import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThTimestampDistanceFromNowPipe} from '../../../../../../../../../../../../../common/utils/pipes/ThTimestampDistanceFromNowPipe';
import {EditSaveButtonGroupComponent} from '../../../../../../../../../../../../../common/utils/components/button-groups/EditSaveButtonGroupComponent';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {ThTimestampDO} from '../../../../../../../../../../../services/common/data-objects/th-dates/ThTimestampDO';
import {RoomDO, RoomMaintenanceStatus} from '../../../../../../../../../../../services/rooms/data-objects/RoomDO';
import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomMaintenanceUtils} from '../../../../../../../../../../../services/rooms/utils/RoomMaintenanceUtils';
import {RoomMaintenanceMeta} from '../../../../../../../../../../../services/rooms/utils/RoomMaintenanceMeta';
import {HotelOperationsRoomService} from '../../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';

@Component({
    selector: 'room-maintenance-status-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/room-operations/components/maintenance-status/template/room-maintenance-status-editor.html',
    directives: [EditSaveButtonGroupComponent],
    pipes: [TranslationPipe, ThTimestampDistanceFromNowPipe]
})
export class RoomMaintenanceStatusEditorComponent implements OnInit {
    @Output() onMaintenanceStatusChanged = new EventEmitter<RoomDO>();
    public triggerOnMaintenanceStatusChanged(updatedRoom: RoomDO) {
        this.onMaintenanceStatusChanged.next(updatedRoom);
    }

    private _didInit: boolean = false;
    readonly: boolean = true;
    isSaving: boolean = false;

    private _roomVM: RoomVM;
    public get roomVM(): RoomVM {
        return this._roomVM;
    }
    @Input()
    public set roomVM(roomVM: RoomVM) {
        this._roomVM = roomVM;
        this.loadDependentData();
    }

    private _roomMaintenanceUtils: RoomMaintenanceUtils;

    currentMaintenanceMeta: RoomMaintenanceMeta;
    currentMaintenanceText: string;
    lastChangeTimestamp: ThTimestampDO;

    currentMaintenanceMetaCopy: RoomMaintenanceMeta;
    currentMaintenanceTextCopy: string;

    constructor(private _appContext: AppContext,
        private _hotelOperationsRoomService: HotelOperationsRoomService) {
        this._roomMaintenanceUtils = new RoomMaintenanceUtils();
        this.currentMaintenanceMeta = this.roomMaintenanceMetaList[0];
    }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._roomVM)) { return };
        this.currentMaintenanceMeta = this._roomMaintenanceUtils.getRoomMaintenanceMetaByStatus(this._roomVM.room.maintenanceStatus);
        this.currentMaintenanceText = this._roomVM.room.maintenanceMessage;
        this.lastChangeTimestamp = null;
        if (this._roomVM.room.maintenanceHistory.hasActionHistory()) {
            this.lastChangeTimestamp = this._roomVM.room.maintenanceHistory.getLastAction().thTimestampDO;
        }
        this.isSaving = false;
    }

    public startEdit() {
        this.readonly = false;
        this.currentMaintenanceMetaCopy = this.currentMaintenanceMeta.buildPrototype();
        this.currentMaintenanceTextCopy = this.currentMaintenanceText;
        this.currentMaintenanceText = "";
    }
    public endEdit() {
        this.readonly = true;
        this.currentMaintenanceMeta = this._roomMaintenanceUtils.getRoomMaintenanceMetaByStatus(this.currentMaintenanceMetaCopy.maintenanceStatus);
        this.currentMaintenanceText = this.currentMaintenanceTextCopy;
    }
    public saveMaintenanceStatus() {
        if (this.currentMaintenanceMeta.maintenanceStatus !== RoomMaintenanceStatus.OutOfService
            && this.currentMaintenanceMeta.maintenanceStatus !== RoomMaintenanceStatus.OutOfOrder) {
            this.saveMaintenanceStatusCore();
            return;
        }
        var message = "This action is used to signal long maintenances on this room and will remove it from your active inventory. Are you sure you want to mark the room as Out of Order?";
        var title = "Out of Order";
        if (this.currentMaintenanceMeta.maintenanceStatus === RoomMaintenanceStatus.OutOfService) {
            message = "This action means that the room requires some maintenance and you can't check in customers. Are you sure you want to mark the room as Out of Service?";
            title = "Out of Service";
        }

        var title = this._appContext.thTranslation.translate(title);
        var content = this._appContext.thTranslation.translate(message);
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.saveMaintenanceStatusCore();
            }, () => { });
    }

    private saveMaintenanceStatusCore() {
        this.isSaving = true;
        this._hotelOperationsRoomService.updateMaintenanceStatus({
            id: this._roomVM.room.id,
            maintenanceMessage: this.currentMaintenanceText,
            maintenanceStatus: this.currentMaintenanceMeta.maintenanceStatus
        }).subscribe((updatedRoom: RoomDO) => {
            this._appContext.analytics.logEvent("room", "maintenance-status", "Changed the maintenance status for a room");
            this.readonly = true;
            this.isSaving = false;
            this.triggerOnMaintenanceStatusChanged(updatedRoom);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }

    public get roomMaintenanceMetaList(): RoomMaintenanceMeta[] {
        return this._roomMaintenanceUtils.getRoomMaintenanceMetaList();
    }
}