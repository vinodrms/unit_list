import {Component, ViewChild, AfterViewInit, Input, Output, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../common/utils/AppContext';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {InventoryStateManager} from '../../utils/state-manager/InventoryStateManager';
import {InventoryScreenStateType} from '../../utils/state-manager/InventoryScreenStateType';
import {InventoryScreenAction} from '../../utils/state-manager/InventoryScreenAction';
import {RoomCategoriesService} from '../../../../../services/room-categories/RoomCategoriesService';
import {YieldFiltersService} from '../../../../../services/hotel-configurations/YieldFiltersService';
import {PriceProductsService} from '../../../../../services/price-products/PriceProductsService';
import {PriceProductVM} from '../../../../../services/price-products/view-models/PriceProductVM';
import {PriceProductStatus} from '../../../../../services/price-products/data-objects/PriceProductDO';
import {ILazyLoadRequestService, LazyLoadData, PageContent} from '../../../../../services/common/ILazyLoadRequestService';
import {PriceProductTableMetaBuilderService} from './services/PriceProductTableMetaBuilderService';

@Component({
	selector: 'price-products',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/main/template/price-products.html',
	providers: [RoomCategoriesService, YieldFiltersService, PriceProductsService, PriceProductTableMetaBuilderService],
	directives: [LazyLoadingTableComponent]
})
export class PriceProductsComponent extends BaseComponent implements AfterViewInit {
	@Output() protected onScreenStateTypeChanged = new EventEmitter();

	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<any>;

	private _inventoryStateManager: InventoryStateManager<any>;

	constructor(private _appContext: AppContext,
		private _priceProductsService: PriceProductsService,
		private _tableBuilder: PriceProductTableMetaBuilderService) {
		super();
		this._inventoryStateManager = new InventoryStateManager<any>(this._appContext, "priceProduct.id");
		this.registerStateChange();
		this.setDefaultPriceProductStatus();
	}
	private registerStateChange() {
		this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
			this.onScreenStateTypeChanged.next(currentState);
		});
	}
	private setDefaultPriceProductStatus() {
		this._priceProductsService.setStatusFilter(PriceProductStatus.Active);
	}

	public ngAfterViewInit() {
		this._aopTableComponent.bootstrap(this._priceProductsService, this._tableBuilder.buildLazyLoadTableMeta());
	}

	public get isEditing(): boolean {
		return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
	}
	public get selectedPriceProductVM(): any {
		return this._inventoryStateManager.currentItem;
	}
}