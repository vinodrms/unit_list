import {Component, AfterViewInit, ViewChild} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogInstance} from '../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {AddOnProductDO} from '../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductVM} from '../../../../../services/add-on-products/view-models/AddOnProductVM';
import {AddOnProductsService} from '../../../../../services/add-on-products/AddOnProductsService';
import {TaxService} from '../../../../../services/taxes/TaxService';
import {SETTINGS_PROVIDERS} from '../../../../../services/settings/SettingsProviders';
import {HotelAggregatorService} from '../../../../../services/hotel/HotelAggregatorService';
import {HotelService} from '../../../../../services/hotel/HotelService';
import {AddOnProductTableMetaBuilderService} from '../main/services/AddOnProductTableMetaBuilderService';
import {LazyLoadTableMeta, TableRowCommand} from '../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Component({
	selector: 'add-on-products-modal',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/add-on-products/modal/template/add-on-products-modal.html',
	providers: [SETTINGS_PROVIDERS, TaxService, HotelService, HotelAggregatorService, AddOnProductsService, AddOnProductTableMetaBuilderService],
	directives: [LazyLoadingTableComponent],
	pipes: [TranslationPipe]
})
export class AddOnProductsModalComponent extends BaseComponent implements ICustomModalComponent, AfterViewInit {
	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<AddOnProductVM>;

	private _selectedAddOnProductList: AddOnProductDO[] = [];

	constructor(private _appContext: AppContext,
		private _modalDialogInstance: ModalDialogInstance<AddOnProductDO[]>,
		private _tableBuilder: AddOnProductTableMetaBuilderService,
		private _addOnProductsService: AddOnProductsService) {
		super();
	}

	public ngAfterViewInit() {
		this.bootstrapAddOnProductsTable();
	}
	private bootstrapAddOnProductsTable() {
		var lazyLoadTableMeta: LazyLoadTableMeta = this._tableBuilder.buildLazyLoadTableMeta(false);
		lazyLoadTableMeta.supportedRowCommandList = [TableRowCommand.Search, TableRowCommand.MultipleSelect];
		lazyLoadTableMeta.autoSelectRows = true;
		this._aopTableComponent.bootstrap(this._addOnProductsService, lazyLoadTableMeta);
	}

	public closeDialog() {
		this._modalDialogInstance.closeForced();
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
	public didSelectAddOnProduct(): boolean {
		return this._selectedAddOnProductList.length > 0;
	}
	public triggerSelectedAddOnProduct() {
		if (!this.didSelectAddOnProduct()) {
			return;
		}
		this._modalDialogInstance.addResult(this._selectedAddOnProductList);
		this.closeDialog();
	}
}