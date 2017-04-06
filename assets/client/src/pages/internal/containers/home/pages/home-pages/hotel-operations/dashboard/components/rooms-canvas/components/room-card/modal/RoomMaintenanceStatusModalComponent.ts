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

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<boolean>,
        private _roomMaintenanceStatusModalInput: RoomMaintenanceStatusModalInput) {
        super();
        this._roomMaintenanceUtils = new RoomMaintenanceUtils();
        this._newMaintenanceMeta = this.roomMaintenanceMetaList[0];
        debugger
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
        if (this._newMaintenanceMeta.maintenanceStatus !== RoomMaintenanceStatus.OutOfService
            && this._newMaintenanceMeta.maintenanceStatus !== RoomMaintenanceStatus.OutOfOrder) {
            this.saveMaintenanceStatusCore();
            return;
        }
        
        if(this._hasCheckedInBooking) {
            var errMessage = this._appContext.thTranslation.translate("Please check out the room first or move the booking to another room");
            this._appContext.toaster.error(errMessage);
            return;
        }

        var message = "This action is used to signal long maintenances on this room and will remove it from your active inventory. Are you sure you want to mark the room as Out of Order?";
        var title = "Out of Order";
        if (this._newMaintenanceMeta.maintenanceStatus === RoomMaintenanceStatus.OutOfService) {
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
        this._roomMaintenanceStatusModalInput.hotelOperationsRoomService.updateMaintenanceStatus({
            id: this._roomMaintenanceStatusModalInput.roomVM.room.id,
            maintenanceMessage: this._newMaintenanceText,
            maintenanceStatus: this._newMaintenanceMeta.maintenanceStatus
        }).subscribe((updatedRoom: RoomDO) => {
            this._appContext.analytics.logEvent("room", "maintenance-status", "Changed the maintenance status for a room");
           this.closeDialog();
        }, (error: ThError) => {
            this._appContext.toaster.error(error.message);
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