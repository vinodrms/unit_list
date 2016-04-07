import {Component, ViewChild, AfterViewInit, Output, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../common/utils/AppContext';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {BedVM} from '../../../../../services/beds/view-models/BedVM';
import {BedTableMetaBuilderService} from './services/BedTableMetaBuilderService';
import {BedsService} from '../../../../../services/beds/BedsService';
import {BedDO} from '../../../../../services/beds/data-objects/BedDO';
import {InventoryStateManager} from '../../utils/state-manager/InventoryStateManager';
import {InventoryScreenStateType} from '../../utils/state-manager/InventoryScreenStateType';
import {InventoryScreenAction} from '../../utils/state-manager/InventoryScreenAction';
import {BedOverviewComponent} from '../pages/bed-overview/BedOverviewComponent';
import {BedEditComponent} from '../pages/bed-edit/BedEditComponent';

@Component({
    selector: 'beds',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/beds/main/template/beds.html',
    providers: [BedsService, BedTableMetaBuilderService],
    directives: [LazyLoadingTableComponent, BedOverviewComponent, BedEditComponent]
})
export class BedsComponent extends BaseComponent {
    @Output() protected onScreenStateTypeChanged = new EventEmitter();
    
    @ViewChild(LazyLoadingTableComponent)
	private _bedTableComponent: LazyLoadingTableComponent<BedVM>;
    
    private _inventoryStateManager: InventoryStateManager<BedVM>;
    
    constructor(private _appContext: AppContext,
		private _tableBuilder: BedTableMetaBuilderService,
		private _bedsService: BedsService) {
		super();
		this._inventoryStateManager = new InventoryStateManager<BedVM>(this._appContext, "bed.id");
		this.registerStateChange();
	}
    private registerStateChange() {
		this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
			this.onScreenStateTypeChanged.next(currentState);
		});
	}
    
    public ngAfterViewInit() {
        debugger
		this._bedTableComponent.bootstrap(this._bedsService, this._tableBuilder.buildLazyLoadTableMeta());
	}
    
    public get isEditing(): boolean {
		return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
	}
    public get selectedBedVM(): BedVM {
		return this._inventoryStateManager.currentItem;
	}
    public addBed() {
		var newBedVM = this.buildNewBedVM();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Add).then((newState: InventoryScreenStateType) => {
			this._bedTableComponent.deselectItem();

			this._inventoryStateManager.currentItem = newBedVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}
    public copyBed(bedVM: BedVM) {
		var newBedVM = bedVM.buildPrototype();
		delete newBedVM.bed.id;
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Copy, newBedVM).then((newState: InventoryScreenStateType) => {
			this._bedTableComponent.deselectItem();

			this._inventoryStateManager.currentItem = newBedVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}
    public editBed(bedVM: BedVM) {
		var newAddOnProductVM = bedVM.buildPrototype();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Edit, newAddOnProductVM).then((newState: InventoryScreenStateType) => {
			this._bedTableComponent.selectItem(bedVM.bed.id);

			this._inventoryStateManager.currentItem = newAddOnProductVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}
    public deleteBed(bedVM: BedVM) {
		var newBedVM = bedVM.buildPrototype();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Delete, newBedVM).then((newState: InventoryScreenStateType) => {
			var title = this._appContext.thTranslation.translate("Delete Bed");
			var content = this._appContext.thTranslation.translate("Are you sure you want to delete %name% ?", { name: bedVM.bed.name });

			this._appContext.modalService.confirm(title, content, () => {
				if (newState === InventoryScreenStateType.View) {
					this._bedTableComponent.deselectItem();
					this._inventoryStateManager.currentItem = null;
				}
				this._inventoryStateManager.screenStateType = newState;
				this.deleteBedOnServer(newBedVM.bed);
			});
		}).catch((e: any) => { });
	}
    
    private deleteBedOnServer(bedDO: BedDO) {
		this._bedsService.deleteBedDO(bedDO).subscribe((deletedBed: BedDO) => {
		}, (error: ThError) => {
			this._appContext.toaster.error(error.message);
		});
	}
    
    public selectBed(bedVM: BedVM) {
		var newBedVM = bedVM.buildPrototype();
		this._inventoryStateManager.canPerformAction(InventoryScreenAction.Select, newBedVM).then((newState: InventoryScreenStateType) => {
			this._bedTableComponent.selectItem(newBedVM.bed.id);

			this._inventoryStateManager.currentItem = newBedVM;
			this._inventoryStateManager.screenStateType = newState;
		}).catch((e: any) => { });
	}

	public showViewScreen() {
		this._bedTableComponent.deselectItem();

		this._inventoryStateManager.currentItem = null;
		this._inventoryStateManager.screenStateType = InventoryScreenStateType.View;
	}
    
    private buildNewBedVM(): BedVM {
		var vm = new BedVM();
		vm.bed = new BedDO();
		return vm;
	}
}