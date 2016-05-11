import {Component, AfterViewInit, ViewChild, ViewContainerRef, EventEmitter, Output, DynamicComponentLoader, Type, ResolvedReflectiveProvider} from '@angular/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../common/utils/AppContext';
import {InventoryStateManager} from '../../utils/state-manager/InventoryStateManager';
import {InventoryScreenStateType} from '../../utils/state-manager/InventoryScreenStateType';
import {InventoryScreenAction} from '../../utils/state-manager/InventoryScreenAction';
import {RoomCategoriesService} from '../../../../../services/room-categories/RoomCategoriesService';
import {EagerPriceProductsService} from '../../../../../services/price-products/EagerPriceProductsService';
import {EagerCustomersService} from '../../../../../services/customers/EagerCustomersService';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {AllotmentVM} from '../../../../../services/allotments/view-models/AllotmentVM';
import {AllotmentStatus} from '../../../../../services/allotments/data-objects/AllotmentDO';
import {AllotmentsService} from '../../../../../services/allotments/AllotmentsService';
import {AllotmentsTableMetaBuilderService} from './services/AllotmentsTableMetaBuilderService';
import {AllotmentOverviewComponent} from '../pages/allotment-overview/AllotmentOverviewComponent';

@Component({
	selector: 'allotments',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/allotments/main/template/allotments.html',
	providers: [AllotmentsService, AllotmentsTableMetaBuilderService, EagerCustomersService, EagerPriceProductsService, RoomCategoriesService],
	directives: [LazyLoadingTableComponent, AllotmentOverviewComponent],
	pipes: [TranslationPipe]
})
export class AllotmentsComponent extends BaseComponent implements AfterViewInit {
	@Output() protected onScreenStateTypeChanged = new EventEmitter();
	@ViewChild('overviewBottom', { read: ViewContainerRef }) private _overviewBottomVCRef: ViewContainerRef;

	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<AllotmentVM>;

	private _inventoryStateManager: InventoryStateManager<AllotmentVM>;
	private _allotmentStatus: AllotmentStatus;

	constructor(private _dynamicComponentLoader: DynamicComponentLoader,
		private _appContext: AppContext,
		private _allotmentsService: AllotmentsService,
		private _tableBuilder: AllotmentsTableMetaBuilderService) {
		super();
		this._inventoryStateManager = new InventoryStateManager<AllotmentVM>(this._appContext, "allotment.id");
		this.registerStateChange();
		this.setDefaultAllotmentStatus();
	}
	public bootstrapOverviewBottom(componentToInject: Type, providers: ResolvedReflectiveProvider[]) {
        this._dynamicComponentLoader.loadNextToLocation(componentToInject, this._overviewBottomVCRef, providers);
    }
	private registerStateChange() {
		this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
			this.onScreenStateTypeChanged.next(currentState);
		});
	}
	private setDefaultAllotmentStatus() {
		this._allotmentStatus = AllotmentStatus.Active;
		this._allotmentsService.setStatusFilter(this.allotmentStatus);
	}

	public ngAfterViewInit() {
		this._aopTableComponent.bootstrap(this._allotmentsService, this._tableBuilder.buildLazyLoadTableMeta());
	}

	protected get isEditing(): boolean {
		return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
	}
	protected get selectedAllotmentVM(): AllotmentVM {
		return this._inventoryStateManager.currentItem;
	}

	protected selectAllotment(allotmentVM: AllotmentVM) {
        var newAllotmentVM = allotmentVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Select, newAllotmentVM).then((newState: InventoryScreenStateType) => {
            this._aopTableComponent.selectItem(newAllotmentVM);

            this._inventoryStateManager.currentItem = newAllotmentVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }


	protected areActiveAllotments(): boolean {
		return this.allotmentStatus === AllotmentStatus.Active;
	}
	protected viewActiveAllotments() {
		this.allotmentStatus = AllotmentStatus.Active;
	}
	protected areArchivedAllotments(): boolean {
		return this.allotmentStatus === AllotmentStatus.Archived;
	}
	protected viewArchivedAllotments() {
		this.allotmentStatus = AllotmentStatus.Archived;
	}

	public get allotmentStatus(): AllotmentStatus {
		return this._allotmentStatus;
	}
	public set allotmentStatus(allotmentStatus: AllotmentStatus) {
		if (allotmentStatus === this._allotmentStatus) {
			return;
		}
		this._allotmentStatus = allotmentStatus;
		this.updatePageData();
	}
	private updatePageData() {
		this._allotmentsService.setStatusFilter(this._allotmentStatus);
		this._allotmentsService.refreshData();
	}
}