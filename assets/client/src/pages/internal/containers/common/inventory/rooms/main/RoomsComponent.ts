import {Component, ViewChild, AfterViewInit, Output, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../common/utils/AppContext';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {RoomsService} from '../../../../../services/rooms/RoomsService';
import {RoomCategoriesService} from '../../../../../services/room-categories/RoomCategoriesService';
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
    providers: [BedsEagerService, RoomsService, RoomCategoriesService, RoomTableMetaBuilderService],
    directives: [LazyLoadingTableComponent, RoomOverviewComponent, RoomEditComponent]
})
export class RoomsComponent extends BaseComponent {
    @Output() protected onScreenStateTypeChanged = new EventEmitter();

    @ViewChild(LazyLoadingTableComponent)
    private _roomTableComponent: LazyLoadingTableComponent<RoomVM>;

    private _inventoryStateManager: InventoryStateManager<RoomVM>;

    constructor(private _appContext: AppContext,
        private _tableBuilder: RoomTableMetaBuilderService,
        private _roomService: RoomsService) {
        super();
        this._inventoryStateManager = new InventoryStateManager<RoomVM>(this._appContext, "room.id");
        this.registerStateChange();
    }

    private registerStateChange() {
        this._inventoryStateManager.stateChangedObservable.subscribe((currentState: InventoryScreenStateType) => {
            this.onScreenStateTypeChanged.next(currentState);
        });
    }

    public ngAfterViewInit() {
        this._roomTableComponent.bootstrap(this._roomService, this._tableBuilder.buildLazyLoadTableMeta());
    }

    public get isEditing(): boolean {
        return this._inventoryStateManager.screenStateType === InventoryScreenStateType.Edit;
    }
    public get selectedRoomVM(): RoomVM {
        return this._inventoryStateManager.currentItem;
    }

    public addRoom() {
        var newRoomVM = this.buildNewRoomVM();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Add).then((newState: InventoryScreenStateType) => {
            this._roomTableComponent.deselectItem();
            this._inventoryStateManager.currentItem = newRoomVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    public copyRoom(roomVM: RoomVM) {
        var newRoomVM = roomVM.buildPrototype();
        delete newRoomVM.room.id;
        newRoomVM.room.name='';
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Copy, newRoomVM).then((newState: InventoryScreenStateType) => {
            this._roomTableComponent.deselectItem();

            this._inventoryStateManager.currentItem = newRoomVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    public editRoom(roomVM: RoomVM) {
        var newRoomVM = roomVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Edit, newRoomVM).then((newState: InventoryScreenStateType) => {
            this._roomTableComponent.selectItem(roomVM.room.id);

            this._inventoryStateManager.currentItem = newRoomVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    public deleteRoom(roomVM: RoomVM) {
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
        this._roomService.deleteRoomDO(roomDO).subscribe((deletedRoom: RoomDO) => {
        }, (error: ThError) => {
            this._appContext.toaster.error(error.message);
        });
    }

    public selectRoom(roomVM: RoomVM) {
        var newRoomVM = roomVM.buildPrototype();
        this._inventoryStateManager.canPerformAction(InventoryScreenAction.Select, newRoomVM).then((newState: InventoryScreenStateType) => {
            this._roomTableComponent.selectItem(newRoomVM.room.id);

            this._inventoryStateManager.currentItem = newRoomVM;
            this._inventoryStateManager.screenStateType = newState;
        }).catch((e: any) => { });
    }

    public showViewScreen() {
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