import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseFormComponent} from '../../../../../../../../common/base/BaseFormComponent';
import {LoadingComponent} from '../../../../../../../../common/utils/components/LoadingComponent';
import {ImageUploadComponent} from '../../../../../../../../common/utils/components/ImageUploadComponent';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {PricePipe} from '../../../../../../../../common/utils/pipes/PricePipe';
import {AddOnProductVM} from '../../../../../../services/add-on-products/view-models/AddOnProductVM';
import {AddOnProductEditService} from './services/AddOnProductEditService';
import {AddOnProductCategoriesService} from '../../../../../../services/settings/AddOnProductCategoriesService';
import {AddOnProductCategoriesDO} from '../../../../../../services/settings/data-objects/AddOnProductCategoriesDO';
import {AddOnProductCategoryDO} from '../../../../../../services/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {TaxService} from '../../../../../../services/taxes/TaxService';
import {TaxContainerDO} from '../../../../../../services/taxes/data-objects/TaxContainerDO';
import {TaxDO} from '../../../../../../services/taxes/data-objects/TaxDO';
import {HotelAggregatorService} from '../../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../../services/hotel/utils/HotelAggregatedInfo';
import {CurrencyDO} from '../../../../../../services/common/data-objects/currency/CurrencyDO';
import {AddOnProductsService} from '../../../../../../services/add-on-products/AddOnProductsService';
import {AddOnProductDO} from '../../../../../../services/add-on-products/data-objects/AddOnProductDO';

@Component({
	selector: 'add-on-product-edit',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/add-on-products/pages/add-on-product-edit/template/add-on-product-edit.html',
	providers: [AddOnProductEditService],
	directives: [LoadingComponent, ImageUploadComponent],
	pipes: [TranslationPipe, PricePipe],
})

export class AddOnProductEditComponent extends BaseFormComponent implements OnInit {
	isLoading: boolean;
	isSavingAddOnProduct: boolean = false;

	addOnProductCategoryList: AddOnProductCategoryDO[];
	vatList: TaxDO[];
	ccy: CurrencyDO;

	noVatId = "-1";
	imageUrl: string = "";
	addOnProductVatId: string;

	@Input() filteredCategory: AddOnProductCategoryDO;
	public showCategorySelector(): boolean {
		return !this.filteredCategory;
	}
	
	private _addOnProductVM: AddOnProductVM;
	public get addOnProductVM(): AddOnProductVM {
		return this._addOnProductVM;
	}
	@Input()
	public set addOnProductVM(addOnProductVM: AddOnProductVM) {
		this._addOnProductVM = addOnProductVM;
		if(this.filteredCategory) {
			this._addOnProductVM.addOnProduct.categoryId = this.filteredCategory.id;
		}
		
		this.initDefaultAddOnProductData();
		this.initForm();
	}
	
	@Output() onExit = new EventEmitter();
	public showViewScreen() {
		this.onExit.next(true);
	}

	constructor(private _appContext: AppContext,
		private _addOnProductCategoriesService: AddOnProductCategoriesService,
		private _taxService: TaxService,
		private _addOnProductEditService: AddOnProductEditService,
		private _hotelAggregatorService: HotelAggregatorService,
		private _addOnProductsService: AddOnProductsService) {
		super();
	}

	public ngOnInit() {
		this.isLoading = true;
		Observable.combineLatest(
			this._addOnProductCategoriesService.getAddOnProductCategoriesDO(),
			this._taxService.getTaxContainerDO(),
			this._hotelAggregatorService.getHotelAggregatedInfo()
		).subscribe((result: [AddOnProductCategoriesDO, TaxContainerDO, HotelAggregatedInfo]) => {
			result[0].addOnProductCategoryList
			this.addOnProductCategoryList = result[0].addOnProductCategoryList;
			this.vatList = result[1].vatList;
			this.ccy = result[2].ccy;
			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
		});
	}

	private initDefaultAddOnProductData() {
		this.imageUrl = "";
		if (this._addOnProductVM.addOnProduct.fileUrlList && this._addOnProductVM.addOnProduct.fileUrlList.length > 0) {
			this.imageUrl = this._addOnProductVM.addOnProduct.fileUrlList[0];
		}
		this.addOnProductVatId = this.noVatId;
		if (this._addOnProductVM.vatTax) {
			this.addOnProductVatId = this._addOnProductVM.vatTax.id;
		}
	}
	private initForm() {
		this.didSubmitForm = false;
		this._addOnProductEditService.updateFormValues(this._addOnProductVM);
	}

	public didChangeCategoryId(newCategoryId: string) {
		this._addOnProductVM.addOnProduct.categoryId = newCategoryId;
	}
	public didUploadImage(imageUrl: string) {
		this.imageUrl = imageUrl;
	}
	public didSelectTaxId(taxId: string) {
		this.addOnProductVatId = taxId;
	}

	protected getDefaultControlGroup(): ControlGroup {
		return this._addOnProductEditService.addOnProductForm;
	}
	public didSelectCategory(): boolean {
		return this._addOnProductVM.addOnProduct.categoryId != null;
	}
	public isNewAddOnProduct(): boolean {
		return this._addOnProductVM.addOnProduct.id == null || this._addOnProductVM.addOnProduct.id.length == 0;
	}

	public saveAddOnProduct() {
		this.didSubmitForm = true;
		if (!this._addOnProductEditService.isValidForm() || !this.didSelectCategory) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}
		var addOnProduct = this._addOnProductVM.addOnProduct;
		this._addOnProductEditService.updateAddOnProduct(addOnProduct);
		addOnProduct.fileUrlList = [];
		if (this.imageUrl) {
			addOnProduct.fileUrlList.push(this.imageUrl);
		}
		addOnProduct.taxIdList = [];
		if (this.addOnProductVatId !== this.noVatId) {
			addOnProduct.taxIdList.push(this.addOnProductVatId);
		}
		this.isSavingAddOnProduct = true;
		this._addOnProductsService.saveAddOnProductDO(addOnProduct).subscribe((updatedAddOnProduct: AddOnProductDO) => {
			this.isSavingAddOnProduct = false;
			this.showViewScreen();
		}, (error: ThError) => {
			this.isSavingAddOnProduct = false;
			this._appContext.toaster.error(error.message);
		});
	}
}