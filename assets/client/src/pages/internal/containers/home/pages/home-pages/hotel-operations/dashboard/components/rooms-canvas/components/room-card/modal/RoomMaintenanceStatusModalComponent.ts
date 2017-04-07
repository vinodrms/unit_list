import {Component, OnInit} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {RoomDO, RoomMaintenanceStatus} from '../../../../../../../../../../../services/rooms/data-objects/RoomDO';
import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomMaintenanceUtils} from '../../../../../../../../../../../services/rooms/utils/RoomMaintenanceUtils';
import {RoomMaintenanceMeta} from '../../../../../../../../../../../services/rooms/utils/RoomMaintenanceMeta';
import {HotelOperationsRoomService} from '../../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {RoomMaintenanceStatusModalInput} from './utils/RoomMaintenanceStatusModalInput';
import {BaseComponent} from '../../../../../../../../../../../../../common/base/BaseComponent';
import {ICustomModalComponent, ModalSize} from "../../../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent";
import {ModalDialogRef} from "../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import {RoomAttachedBookingResultVM} from '../../../../../../../../../../../services/hotel-operations/room/view-models/RoomAttachedBookingResultVM';
import {RoomMaintenanceStatusUpdater} from '../../../../../../common/RoomMaintenanceStatusUpdater';

@Component({
    selector: 'room-maintenance-status-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/rooms-canvas/components/room-card/modal/template/room-maintenance-status-modal-component.html'
})
export class RoomMaintenanceStatusModalComponent extends BaseComponent implements ICustomModalComponent, OnInit {
    private _roomMaintenanceUtils: RoomMaintenanceUtils;

    private _newMaintenanceMeta: RoomMaintenanceMeta;
    private _newMaintenanceText: string;
    private _hasCheckedInBooking: boolean;
    private _isLoading: boolean;
    private _roomMaintenanceStatusUpdater: RoomMaintenanceStatusUpdater;

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<boolean>,
        private _roomMaintenanceStatusModalInput: RoomMaintenanceStatusModalInput) {
        super();
        this._roomMaintenanceUtils = new RoomMaintenanceUtils();
        this._newMaintenanceMeta = this.roomMaintenanceMetaList[0];
        this._roomMaintenanceStatusUpdater = new RoomMaintenanceStatusUpdater(this._appContext, this._roomMaintenanceStatusModalInput.hotelOperationsRoomService);
    }

    ngOnInit() {
        this._isLoading = true;
        this._roomMaintenanceStatusModalInput.hotelOperationsRoomService.getAttachedBooking(this._roomMaintenanceStatusModalInput.roomVM.room.id).subscribe((roomBookingResult: RoomAttachedBookingResultVM) => {
            this._hasCheckedInBooking = roomBookingResult.roomAttachedBookingResultDO.hasCheckedInBooking();
            this._isLoading = false;
            this._newMaintenanceMeta = this.roomMaintenanceMetaList[0];
        }, (error: ThError) => {
            this._appContext.toaster.error(error.message);
            this._isLoading = false;
            this._newMaintenanceMeta = this.roomMaintenanceMetaList[0];
        });
    }

    public isBlocking() : boolean {
        return false;
    }

    public getSize(): ModalSize {
        return ModalSize.Medium;
    }

    public closeDialog() {
        this._modalDialogRef.closeForced();
    }

    public saveMaintenanceStatus() {
        this._roomMaintenanceStatusUpdater.saveMaintenanceStatus(this._roomMaintenanceStatusModalInput.roomVM.room.id, this._newMaintenanceMeta, this._newMaintenanceText, this._hasCheckedInBooking)
        .then((updatedRoom: RoomDO) => {
            if (updatedRoom != null) {
                this.closeDialog();
            }
        })
        .catch((error: ThError) => {
            this.closeDialog();
        });
    }

    public get roomMaintenanceMetaList(): RoomMaintenanceMeta[] {
        return this._roomMaintenanceUtils.getRoomMaintenanceMetaList();
    }

    public get isLoading(): boolean {
        return this._isLoading;
    }

    public get newMaintenanceMeta(): RoomMaintenanceMeta {
        return this._newMaintenanceMeta;
    }

    public set newMaintenanceMeta(meta: RoomMaintenanceMeta) {
        this._newMaintenanceMeta = meta;
    }

    public get newMaintenanceText(): string {
        return this._newMaintenanceText;
    }

    public set newMaintenanceText(text: string) {
        this._newMaintenanceText = text;
    }
}