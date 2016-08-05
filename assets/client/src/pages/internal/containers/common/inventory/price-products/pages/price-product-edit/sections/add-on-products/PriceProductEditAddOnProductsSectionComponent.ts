import {Component, Input} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {PricePipe} from '../../../../../../../../../../common/utils/pipes/PricePipe';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {IPriceProductEditSection} from '../utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {AddOnProductsModalService} from '../../../../../add-on-products/modal/services/AddOnProductsModalService';
import {AddOnProductDO} from '../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {CurrencyDO} from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import {AddOnProductCategoriesDO} from '../../../../../../../../services/settings/data-objects/AddOnProductCategoriesDO';

@Component({
	selector: 'price-product-edit-add-on-products-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/add-on-products/template/price-product-edit-add-on-products-section.html',
	providers: [AddOnProductsModalService],
	pipes: [TranslationPipe, PricePipe]
})
export class PriceProductEditAddOnProductsSectionComponent extends BaseComponent implements IPriceProductEditSection {
	readonly: boolean;
	@Input() didSubmit: boolean;

	private _breakfastCategoryId: string;
	ccy: CurrencyDO;
	private _addOnProductList: AddOnProductDO[];
	private _breakfast: AddOnProductDO;

	constructor(private _appContext: AppContext,
		private _addOnProductsModalService: AddOnProductsModalService) {
		super();
	}

	public didInitialize(): boolean {
		return this.ccy != null;
	}

	public isValid(): boolean {
		return true;
	}
	public initializeFrom(priceProductVM: PriceProductVM, addOnProductCategories: AddOnProductCategoriesDO) {
		this._addOnProductList = [];
		this._breakfast = null;
		this.updateBreakfastId(addOnProductCategories);
		if (priceProductVM.addOnProductList && priceProductVM.addOnProductList.length > 0) {
			this._addOnProductList = this._addOnProductList.concat(this.filterNonBreakfastAddOnProducts(priceProductVM.addOnProductList));
			this._breakfast = _.find(priceProductVM.addOnProductList, (addOnProduct: AddOnProductDO) => { return addOnProduct.categoryId === this._breakfastCategoryId });
		}
		this.ccy = priceProductVM.ccy;
	}
	private updateBreakfastId(addOnProductCategories: AddOnProductCategoriesDO) {
		if (!this._breakfastCategoryId) {
			this._breakfastCategoryId = addOnProductCategories.getBreakfastCategory().id;
		}
	}
	private filterNonBreakfastAddOnProducts(addOnProductList: AddOnProductDO[]): AddOnProductDO[] {
		return _.filter(addOnProductList, (addOnProductList: AddOnProductDO) => { return addOnProductList.categoryId !== this._breakfastCategoryId });
	}

	public updateDataOn(priceProductVM: PriceProductVM) {
		priceProductVM.addOnProductList = this._addOnProductList;
		if (this.didSelectBreakfast()) {
			priceProductVM.addOnProductList = priceProductVM.addOnProductList.concat(this.breakfast);
		}
		priceProductVM.priceProduct.addOnProductIdList = _.map(priceProductVM.addOnProductList, (addOnProduct: AddOnProductDO) => { return addOnProduct.id });
	}

	public removeAddOnProduct(addOnProduct: AddOnProductDO) {
		this._addOnProductList = _.filter(this._addOnProductList, (innerAddOnProduct: AddOnProductDO) => { return innerAddOnProduct.id !== addOnProduct.id });
	}

	public openAddOnProductSelectModal() {
		this._addOnProductsModalService.openAddOnProductsModal().then((modalDialogInstance: ModalDialogRef<AddOnProductDO[]>) => {
			modalDialogInstance.resultObservable.subscribe((selectedAddOnProductList: AddOnProductDO[]) => {
				_.forEach(selectedAddOnProductList, (aop: AddOnProductDO) => {
					this.addAddOnProductIfNotExists(aop);
				});
			});
		}).catch((e: any) => { });
	}
	public openBreakfastSelectModal() {
		this._addOnProductsModalService.openBreakfastModal().then((modalDialogInstance: ModalDialogRef<AddOnProductDO[]>) => {
			modalDialogInstance.resultObservable.subscribe((selectedAddOnProductList: AddOnProductDO[]) => {
				if (selectedAddOnProductList.length > 0) {
					this._breakfast = selectedAddOnProductList[0];
				}
			});
		}).catch((e: any) => { });
	}
	private addAddOnProductIfNotExists(addOnProductToAdd: AddOnProductDO) {
		var foundAddOnProduct = _.find(this._addOnProductList, (addOnProduct: AddOnProductDO) => { return addOnProduct.id === addOnProductToAdd.id });
		if (!foundAddOnProduct) {
			this._addOnProductList.push(addOnProductToAdd);
		}
	}

	public didSelectBreakfast(): boolean {
		return !this._appContext.thUtils.isUndefinedOrNull(this._breakfast);
	}
	public removeBreakfast() {
		this._breakfast = null;
	}

	public get addOnProductList(): AddOnProductDO[] {
		return this._addOnProductList;
	}
	public set addOnProductList(addOnProductList: AddOnProductDO[]) {
		this._addOnProductList = addOnProductList;
	}
	public get breakfast(): AddOnProductDO {
		return this._breakfast;
	}
	public set breakfast(breakfast: AddOnProductDO) {
		this._breakfast = breakfast;
	}
}