import {Component, ViewChild, AfterViewInit, Input, Output, EventEmitter, Type, ResolvedReflectiveProvider, ViewContainerRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../common/utils/AppContext';
import {ComponentLoaderService} from '../../../../../../../common/utils/components/services/ComponentLoaderService';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {LazyLoadRoomsService} from '../../../../../services/rooms/LazyLoadRoomsService';
import {RoomTableMetaBuilderService} from './services/RoomTableMetaBuilderService';
import {InventoryStateManager} from '../../utils/state-manager/InventoryStateManager';
import {InventoryScreenStateType} from '../../utils/state-manager/InventoryScreenStateType';
import {InventoryScreenAction} from '../../utils/state-manager/InventoryScreenAction';
import {RoomVM} from '../../../../../services/rooms/view-models/RoomVM';
import {RoomDO} from '../../../../../services/rooms/data-objects/RoomDO';
import {RoomOverviewComponent} from '../pages/room-overview/RoomOverviewComponent';
import {RoomEditComponent} from '../pages/room-edit/RoomEditComponent';
import {BedsEagerService} from '../../../../../services/beds/BedsEagerService';

@Component({
    selector: 'rooms',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/rooms/main/template/rooms.html',
    providers: [BedsEagerService, LazyLoadRoomsService, RoomTableMetaBuilderService],
    directives: [LazyLoadingTableComponent, RoomOverviewComponent, RoomEditComponent]
})
export class RoomsComponent extends BaseComponent implements AfterViewInit {
    @Input() showLinkToOperationalModal: boolean = false;
    @Output() protected onScreenStateTypeChanged = new EventEmitter();
    @Output() protected onItemDeleted = new EventEmitter();
    @ViewChild('overviewBottom', { read: ViewContainerRef }) private _overviewBottomVCRef: ViewContainerRef;

    @ViewChild(LazyLoadingTableComponent)
    private _roomTableComponent: LazyLoadingTableComponent<RoomVM>;

    private _inventoryStateManager: InventoryStateManager<RoomVM>;

    constructor(private _appContext: AppContext,
        private _componentLoaderService: ComponentLoaderService,
        private _tableBuilder: RoomTableMetaBuilderService,
        private _lazyLoadRoomService: LazyLoadRoomsService) {
        super();
        this._inventoryStateManager = new InventoryStateManager<RoomVM>(this._appContext, "room.id");
        this.registerStateChange();
    }
    public bootstrapOverviewBottom(componentToInject: Type, providers: ResolvedReflectiveProvider[]) {
        this._componentLoaderService.loadNextToLocation(componentToInject, this._overviewBottomVCRef, providers);
    }

    private registerStateChange() {
        this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
            this.onScreenStateTypeChanged.next(currentState);
        });
    }
    private registerItemDeletion(deletedBed: RoomDO) {
        this.onItemDeleted.next(deletedBed);
    }

    public ngAfterViewInit() {
        this._roomTableComponent.bootstrap(this._lazyLoadRoomService, this._tableBuilder.buildLazyLoadTableMeta());
    }

    protected get isEditing(): boolean {
        return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
    }
    protected get selectedRoomVM(): RoomVM {
        return this._inventoryStateManager.currentItem;
    }

    protected addRoom() {
        var newRoomVM = this.buildNewRoomVM();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Add).then((newState: InventoryScreenStateType) => {
            this._roomTableComponent.deselectItem();
            this._inventoryStateManager.currentItem = newRoomVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    protected copyRoom(roomVM: RoomVM) {
        var newRoomVM = roomVM.buildPrototype();
        delete newRoomVM.room.id;
        newRoomVM.room.name = '';
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Copy, newRoomVM).then((newState: InventoryScreenStateType) => {
            this._roomTableComponent.deselectItem();

            this._inventoryStateManager.currentItem = newRoomVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    protected editRoom(roomVM: RoomVM) {
        var newRoomVM = roomVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Edit, newRoomVM).then((newState: InventoryScreenStateType) => {
            this._roomTableComponent.selectItem(roomVM);

            this._inventoryStateManager.currentItem = newRoomVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    protected deleteRoom(roomVM: RoomVM) {
        var newRoomVM = roomVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Delete, newRoomVM).then((newState: InventoryScreenStateType) => {
            var title = this._appContext.thTranslation.translate("Delete Room");
            var content = this._appContext.thTranslation.translate("Are you sure you want to delete %name% ?", { name: roomVM.room.name });
            var positiveLabel = this._appContext.thTranslation.translate("Yes");
            var negativeLabel = this._appContext.thTranslation.translate("No");
            this._appContext.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
                if (newState === InventoryScreenStateType.View) {
                    this._roomTableComponent.deselectItem();
                    this._inventoryStateManager.currentItem = null;
                }
                this._inventoryStateManager.screenStateType = newState;
                this.deleteRoomOnServer(newRoomVM.room);
            });
        }).catch((e: any) => { });
    }

    private deleteRoomOnServer(roomDO: RoomDO) {
        this._lazyLoadRoomService.deleteRoomDO(roomDO).subscribe((deletedRoom: RoomDO) => {
            this.registerItemDeletion(deletedRoom);
        }, (error: ThError) => {
            this._appContext.toaster.error(error.message);
        });
    }

    protected selectRoom(roomVM: RoomVM) {
        var newRoomVM = roomVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Select, newRoomVM).then((newState: InventoryScreenStateType) => {
            this._roomTableComponent.selectItem(newRoomVM);

            this._inventoryStateManager.currentItem = newRoomVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    protected showViewScreen() {
        this._roomTableComponent.deselectItem();

        this._inventoryStateManager.currentItem = null;
        this._inventoryStateManager.screenStateType = InventoryScreenStateType.View;
    }

    private buildNewRoomVM(): RoomVM {
        var vm = new RoomVM();
        vm.room = new RoomDO();
        return vm;
    }
}