import {Component, AfterViewInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {AddOnProductDO} from '../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductVM} from '../../../../../services/add-on-products/view-models/AddOnProductVM';
import {AddOnProductsService} from '../../../../../services/add-on-products/AddOnProductsService';
import {TaxService} from '../../../../../services/taxes/TaxService';
import {SETTINGS_PROVIDERS} from '../../../../../services/settings/SettingsProviders';
import {HotelAggregatorService} from '../../../../../services/hotel/HotelAggregatorService';
import {HotelService} from '../../../../../services/hotel/HotelService';
import {AddOnProductTableMetaBuilderService} from '../main/services/AddOnProductTableMetaBuilderService';
import {LazyLoadTableMeta, TableRowCommand} from '../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import {AddOnProductCategoriesService} from '../../../../../services/settings/AddOnProductCategoriesService';
import {AddOnProductCategoriesDO} from '../../../../../services/settings/data-objects/AddOnProductCategoriesDO';
import {AddOnProductCategoryDO} from '../../../../../services/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {AddOnProductsModalInput} from './services/utils/AddOnProductsModalInput';

@Component({
	selector: 'add-on-products-modal',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/add-on-products/modal/template/add-on-products-modal.html',
	providers: [SETTINGS_PROVIDERS, TaxService, HotelService, HotelAggregatorService, AddOnProductsService, AddOnProductTableMetaBuilderService]
})
export class AddOnProductsModalComponent extends BaseComponent implements ICustomModalComponent, AfterViewInit {
	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<AddOnProductVM>;

	private _selectedAddOnProductList: AddOnProductDO[] = [];

	constructor(private _appContext: AppContext,
		private _modalDialogRef: ModalDialogRef<AddOnProductDO[]>,
		private _tableBuilder: AddOnProductTableMetaBuilderService,
		private _addOnProductsService: AddOnProductsService,
		private _addOnProductCategoriesService: AddOnProductCategoriesService,
		private _modalInput: AddOnProductsModalInput) {
		super();
	}

	public ngAfterViewInit() {
		this._addOnProductCategoriesService.getAddOnProductCategoriesDO().subscribe((addOnProductCategoriesDO: AddOnProductCategoriesDO) => {
            var breakfastCategory: AddOnProductCategoryDO = addOnProductCategoriesDO.getBreakfastCategory();
            if (this._modalInput.filterBreakfast) {
                this._addOnProductsService.setDefaultCategory(breakfastCategory);
            }
            else {
                this._addOnProductsService.setDefaultNotEqualWithCategory(breakfastCategory);
            }
            this.bootstrapAddOnProductsTable();
        });
	}
	private bootstrapAddOnProductsTable() {
		var lazyLoadTableMeta: LazyLoadTableMeta = this._tableBuilder.buildLazyLoadTableMeta(false);
		var selectionRowCommand = TableRowCommand.Select;
		if (this._modalInput.multiSelection) {
			selectionRowCommand = TableRowCommand.MultipleSelect;
		}
		lazyLoadTableMeta.supportedRowCommandList = [TableRowCommand.Search, selectionRowCommand];
		lazyLoadTableMeta.autoSelectRows = true;
		this._aopTableComponent.bootstrap(this._addOnProductsService, lazyLoadTableMeta);
	}
	public get pageTitle(): string {
		if (this._modalInput.filterBreakfast) {
			return "Select Breakfast";
		}
		return "Select Add-On Product";
	}

	public closeDialog() {
		this._modalDialogRef.closeForced();
	}

	public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Large;
	}

	public didSelectAddOnProductList(addOnProductVMList: AddOnProductVM[]) {
		this._selectedAddOnProductList = _.map(addOnProductVMList, (aopVm: AddOnProductVM) => {
			return aopVm.addOnProduct;
		});
	}
	public didSelectAddOnProduct(addOnProductVM: AddOnProductVM) {
		this._selectedAddOnProductList = [addOnProductVM.addOnProduct];
	}

	public didSelectAtLeastOneAddOnProduct(): boolean {
		return this._selectedAddOnProductList.length > 0;
	}
	public triggerSelectedAddOnProduct() {
		if (!this.didSelectAtLeastOneAddOnProduct()) {
			return;
		}
		this._modalDialogRef.addResult(this._selectedAddOnProductList);
		this.closeDialog();
	}
}