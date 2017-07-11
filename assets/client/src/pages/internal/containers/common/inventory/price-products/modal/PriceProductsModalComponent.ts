import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../../../../common/base/BaseComponent';
import { LazyLoadingTableComponent } from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { LazyLoadTableMeta, TableRowCommand } from '../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import { AppContext } from '../../../../../../../common/utils/AppContext';
import { ICustomModalComponent, ModalSize } from '../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import { ModalDialogRef } from '../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { PriceProductTableMetaBuilderService } from '../main/services/PriceProductTableMetaBuilderService';
import { TaxService } from '../../../../../services/taxes/TaxService';
import { RoomCategoriesService } from '../../../../../services/room-categories/RoomCategoriesService';
import { YieldFiltersService } from '../../../../../services/hotel-configurations/YieldFiltersService';
import { PriceProductDO, PriceProductAvailability } from '../../../../../services/price-products/data-objects/PriceProductDO';
import { PriceProductVM } from '../../../../../services/price-products/view-models/PriceProductVM';
import { PriceProductsService } from '../../../../../services/price-products/PriceProductsService';
import { PriceProductsModalInput } from './services/utils/PriceProductsModalInput';
import { SETTINGS_PROVIDERS } from '../../../../../services/settings/SettingsProviders';
import { HotelAggregatorService } from '../../../../../services/hotel/HotelAggregatorService';
import { HotelService } from '../../../../../services/hotel/HotelService';

import * as _ from "underscore";

@Component({
	selector: 'price-products-modal',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/modal/template/price-products-modal.html',
	providers: [SETTINGS_PROVIDERS, PriceProductTableMetaBuilderService, RoomCategoriesService,
		TaxService, HotelService, HotelAggregatorService, YieldFiltersService, PriceProductsService]
})
export class PriceProductsModalComponent extends BaseComponent implements ICustomModalComponent, AfterViewInit {
	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<PriceProductVM>;

	private _selectedPriceProductList: PriceProductDO[] = [];
	private _isPublicAvailability: boolean;

	constructor(private _appContext: AppContext,
		private _modalDialogRef: ModalDialogRef<PriceProductDO[]>,
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
		lazyLoadTableMeta.supportedRowCommandList = [TableRowCommand.Search, TableRowCommand.MultipleSelect];
		lazyLoadTableMeta.autoSelectRows = true;
		this._aopTableComponent.bootstrap(this._priceProductsService, lazyLoadTableMeta);
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

	public didSelectPriceProductList(selectedPriceProductList: PriceProductVM[]) {
		this._selectedPriceProductList = _.map(selectedPriceProductList, (ppVm: PriceProductVM) => {
			return ppVm.priceProduct;
		});
	}
	public didSelectPriceProduct(): boolean {
		return this._selectedPriceProductList.length > 0;
	}
	public triggerSelectedPriceProduct() {
		if (!this.didSelectPriceProduct()) {
			return;
		}
		this._modalDialogRef.addResult(this._selectedPriceProductList);
		this.closeDialog();
	}
}