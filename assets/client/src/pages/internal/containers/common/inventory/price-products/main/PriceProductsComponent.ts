import {Component, ViewChild, AfterViewInit, Input, Output, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../common/utils/AppContext';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {InventoryStateManager} from '../../utils/state-manager/InventoryStateManager';
import {InventoryScreenStateType} from '../../utils/state-manager/InventoryScreenStateType';
import {InventoryScreenAction} from '../../utils/state-manager/InventoryScreenAction';

@Component({
	selector: 'price-products',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/main/template/price-products.html',
	providers: [],
	directives: [LazyLoadingTableComponent]
})
export class PriceProductsComponent extends BaseComponent {
	@Output() protected onScreenStateTypeChanged = new EventEmitter();

	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<any>;

	private _inventoryStateManager: InventoryStateManager<any>;

	constructor(private _appContext: AppContext) {
		super();
		this._inventoryStateManager = new InventoryStateManager<any>(this._appContext, "priceProduct.id");
		this.registerStateChange();
	}
	private registerStateChange() {
		this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
			this.onScreenStateTypeChanged.next(currentState);
		});
	}

	public ngAfterViewInit() {
		// this._aopTableComponent.bootstrap(this._addOnProductsService, this._tableBuilder.buildLazyLoadTableMeta(this.filterBreakfastCategory));
	}

	public get isEditing(): boolean {
		return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
	}
	public get selectedPriceProductVM(): any {
		return this._inventoryStateManager.currentItem;
	}
}