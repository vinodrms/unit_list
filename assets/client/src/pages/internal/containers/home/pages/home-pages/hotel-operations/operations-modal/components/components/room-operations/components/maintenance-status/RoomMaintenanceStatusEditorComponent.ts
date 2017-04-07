import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {ThTimestampDO} from '../../../../../../../../../../../services/common/data-objects/th-dates/ThTimestampDO';
import {RoomDO, RoomMaintenanceStatus} from '../../../../../../../../../../../services/rooms/data-objects/RoomDO';
import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomMaintenanceUtils} from '../../../../../../../../../../../services/rooms/utils/RoomMaintenanceUtils';
import {RoomMaintenanceMeta} from '../../../../../../../../../../../services/rooms/utils/RoomMaintenanceMeta';
import {HotelOperationsRoomService} from '../../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {RoomMaintenanceStatusUpdater} from '../../../../../../common/RoomMaintenanceStatusUpdater';

@Component({
    selector: 'room-maintenance-status-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/room-operations/components/maintenance-status/template/room-maintenance-status-editor.html'
})
export class RoomMaintenanceStatusEditorComponent implements OnInit {
    @Input() hasCheckedInBooking: boolean = false;
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

    private _roomMaintenanceStatusUpdater: RoomMaintenanceStatusUpdater;

    constructor(private _appContext: AppContext,
        private _hotelOperationsRoomService: HotelOperationsRoomService) {
        this._roomMaintenanceUtils = new RoomMaintenanceUtils();
        this.currentMaintenanceMeta = this.roomMaintenanceMetaList[0];
        this._roomMaintenanceStatusUpdater = new RoomMaintenanceStatusUpdater(this._appContext, this._hotelOperationsRoomService);
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
        this._roomMaintenanceStatusUpdater.saveMaintenanceStatus(this.roomVM.room.id, this.currentMaintenanceMeta, this.currentMaintenanceText, this.hasCheckedInBooking)
        .then((updatedRoom: RoomDO) => {
            if (updatedRoom != null) {
                this.readonly = true;
                this.isSaving = false;
                this.triggerOnMaintenanceStatusChanged(updatedRoom);
            }
        })
        .catch((error: ThError) => {
            this.isSaving = false;
        });
    }

    public get roomMaintenanceMetaList(): RoomMaintenanceMeta[] {
        return this._roomMaintenanceUtils.getRoomMaintenanceMetaList();
    }
}