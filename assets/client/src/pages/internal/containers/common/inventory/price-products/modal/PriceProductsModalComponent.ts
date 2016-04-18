import {Component, AfterViewInit, ViewChild} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {LazyLoadTableMeta, TableRowCommand} from '../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext} from '../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogInstance} from '../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {PriceProductTableMetaBuilderService} from '../main/services/PriceProductTableMetaBuilderService';
import {TaxService} from '../../../../../services/taxes/TaxService';
import {RoomCategoriesService} from '../../../../../services/room-categories/RoomCategoriesService';
import {YieldFiltersService} from '../../../../../services/hotel-configurations/YieldFiltersService';
import {PriceProductDO, PriceProductAvailability} from '../../../../../services/price-products/data-objects/PriceProductDO';
import {PriceProductVM} from '../../../../../services/price-products/view-models/PriceProductVM';
import {PriceProductsService} from '../../../../../services/price-products/PriceProductsService';
import {PriceProductsModalInput} from './services/utils/PriceProductsModalInput';

@Component({
	selector: 'price-products-modal',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/modal/template/price-products-modal.html',
	providers: [PriceProductTableMetaBuilderService, RoomCategoriesService, TaxService, YieldFiltersService, PriceProductsService],
	directives: [LazyLoadingTableComponent],
	pipes: [TranslationPipe]
})
export class PriceProductsModalComponent extends BaseComponent implements ICustomModalComponent, AfterViewInit {
	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<PriceProductVM>;

	private _selectedPriceProduct: PriceProductDO;
	private _isPublicAvailability: boolean;

	constructor(private _appContext: AppContext,
		private _modalDialogInstance: ModalDialogInstance<PriceProductDO>,
		private _tableBuilder: PriceProductTableMetaBuilderService,
		private _priceProductsService: PriceProductsService,
		private _modalInput: PriceProductsModalInput) {
		super();
		this._isPublicAvailability = false;
		this._priceProductsService.setStatusFilter(this._modalInput.priceProductStatus);
		this._priceProductsService.setAvailabilityFilter(PriceProductAvailability.Confidential);
	}

	public ngAfterViewInit() {
		this.bootstrapPriceProductsTable();
	}
	private bootstrapPriceProductsTable() {
		var lazyLoadTableMeta: LazyLoadTableMeta = this._tableBuilder.buildLazyLoadTableMeta();
		lazyLoadTableMeta.supportedRowCommandList = [TableRowCommand.Search, TableRowCommand.Select];
		lazyLoadTableMeta.autoSelectRows = true;
		this._aopTableComponent.bootstrap(this._priceProductsService, lazyLoadTableMeta);
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

	public get isPublicAvailability(): boolean {
		return this._isPublicAvailability;
	}
	public set isPublicAvailability(isPublicAvailability: boolean) {
		if (isPublicAvailability === this._isPublicAvailability) {
			return;
		}
		this._isPublicAvailability = isPublicAvailability;
		this.updateAvailabilityFilter();
		this._priceProductsService.refreshData();
	}
	private updateAvailabilityFilter() {
		if (this._isPublicAvailability) {
			this._priceProductsService.setAvailabilityFilter(PriceProductAvailability.Public);
		}
		else {
			this._priceProductsService.setAvailabilityFilter(PriceProductAvailability.Confidential);
		}
	}

	public selectPriceProduct(selectedPriceProduct: PriceProductVM) {
		this._selectedPriceProduct = selectedPriceProduct.priceProduct;
	}
	public didSelectPriceProduct(): boolean {
		return this._selectedPriceProduct != null;
	}
	public triggerSelectedPriceProduct() {
		if (!this.didSelectPriceProduct()) {
			return;
		}
		this._modalDialogInstance.addResult(this._selectedPriceProduct);
		this.closeDialog();
	}
}