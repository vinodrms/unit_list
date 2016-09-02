import {Component, ViewChild, AfterViewInit, Output, EventEmitter, ComponentResolver, Type, ResolvedReflectiveProvider, ViewContainerRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../common/utils/AppContext';
import {ComponentUtils} from '../../../../../../../common/utils/components/utils/ComponentUtils';
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
    @Output() protected onItemDeleted = new EventEmitter();
    @ViewChild('overviewBottom', { read: ViewContainerRef }) private _overviewBottomVCRef: ViewContainerRef;

    @ViewChild(LazyLoadingTableComponent)
    private _bedTableComponent: LazyLoadingTableComponent<BedVM>;

    private _inventoryStateManager: InventoryStateManager<BedVM>;
    private _componentUtils: ComponentUtils;

    constructor(componentResolver: ComponentResolver,
        private _appContext: AppContext,
        private _tableBuilder: BedTableMetaBuilderService,
        private _bedsService: BedsService) {
        super();
        this._componentUtils = new ComponentUtils(componentResolver);
        this._inventoryStateManager = new InventoryStateManager<BedVM>(this._appContext, "bed.id");
        this.registerStateChange();
    }
    public bootstrapOverviewBottom(componentToInject: Type, providers: ResolvedReflectiveProvider[]) {
        this._componentUtils.loadNextToLocation(componentToInject, this._overviewBottomVCRef, providers);
    }

    private registerStateChange() {
        this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
            this.onScreenStateTypeChanged.next(currentState);
        });
    }
    private registerItemDeletion(deletedBed: BedDO) {
        this.onItemDeleted.next(deletedBed);
    }

    protected ngAfterViewInit() {
        this._bedTableComponent.bootstrap(this._bedsService, this._tableBuilder.buildLazyLoadTableMeta());
    }

    protected get isEditing(): boolean {
        return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
    }
    protected get selectedBedVM(): BedVM {
        return this._inventoryStateManager.currentItem;
    }
    protected addBed() {
        var newBedVM = this.buildNewBedVM();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Add).then((newState: InventoryScreenStateType) => {
            this._bedTableComponent.deselectItem();

            this._inventoryStateManager.currentItem = newBedVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }
    protected copyBed(bedVM: BedVM) {
        var newBedVM = bedVM.buildPrototype();
        delete newBedVM.bed.id;
        newBedVM.bed.name = '';
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Copy, newBedVM).then((newState: InventoryScreenStateType) => {
            this._bedTableComponent.deselectItem();

            this._inventoryStateManager.currentItem = newBedVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }
    protected editBed(bedVM: BedVM) {
        var newBedVM = bedVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Edit, newBedVM).then((newState: InventoryScreenStateType) => {
            this._bedTableComponent.selectItem(bedVM);

            this._inventoryStateManager.currentItem = newBedVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }
    protected deleteBed(bedVM: BedVM) {
        var newBedVM = bedVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Delete, newBedVM).then((newState: InventoryScreenStateType) => {
            var title = this._appContext.thTranslation.translate("Delete Bed");
            var content = this._appContext.thTranslation.translate("Are you sure you want to delete %name% ?", { name: bedVM.bed.name });
            var positiveLabel = this._appContext.thTranslation.translate("Yes");
            var negativeLabel = this._appContext.thTranslation.translate("No");
            this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
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
            this.registerItemDeletion(deletedBed);
        }, (error: ThError) => {
            this._appContext.toaster.error(error.message);
        });
    }

    protected selectBed(bedVM: BedVM) {
        var newBedVM = bedVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Select, newBedVM).then((newState: InventoryScreenStateType) => {
            this._bedTableComponent.selectItem(newBedVM);

            this._inventoryStateManager.currentItem = newBedVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    protected showViewScreen() {
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