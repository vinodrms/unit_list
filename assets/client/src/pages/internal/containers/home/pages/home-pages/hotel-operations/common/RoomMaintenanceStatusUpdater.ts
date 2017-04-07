import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {RoomMaintenanceMeta} from '../../../../../../services/rooms/utils/RoomMaintenanceMeta';
import {RoomDO, RoomMaintenanceStatus} from '../../../../../../services/rooms/data-objects/RoomDO';
import {HotelOperationsRoomService} from '../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {ThError} from '../../../../../../../../common/utils/responses/ThError';

export class RoomMaintenanceStatusUpdater {

	constructor(private _appContext: AppContext, private _hotelOperationsRoomService: HotelOperationsRoomService) {};

    public saveMaintenanceStatus(roomId: string, newMaintenanceMeta: RoomMaintenanceMeta, newMaintenanceText: string, hasCheckedInBooking: boolean): Promise<RoomDO> {
        return new Promise<RoomDO>((resolve: { (updatedRoom: RoomDO): void }, reject: { (err: ThError): void }) => {
            this.saveMaintenanceStatusCore(resolve, reject, roomId, newMaintenanceMeta, newMaintenanceText, hasCheckedInBooking);
        });
    }

    private saveMaintenanceStatusCore(resolve: { (updatedRoom: RoomDO): void }, reject: { (err: ThError): void }, roomId: string, newMaintenanceMeta: RoomMaintenanceMeta, newMaintenanceText: string, hasCheckedInBooking: boolean) {
        if (newMaintenanceMeta.maintenanceStatus !== RoomMaintenanceStatus.OutOfService
            && newMaintenanceMeta.maintenanceStatus !== RoomMaintenanceStatus.OutOfOrder) {
            return this.updateMaintenanceStatus(resolve, reject, roomId, newMaintenanceMeta, newMaintenanceText);        
        }
        
        if (hasCheckedInBooking) {
            var errMessage = this._appContext.thTranslation.translate("Please check out the room first or move the booking to another room");
            this._appContext.toaster.error(errMessage);
            resolve(null);
            return;
        }

        var message = "This action is used to signal long maintenances on this room and will remove it from your active inventory. Are you sure you want to mark the room as Out of Order?";
        var title = "Out of Order";
        if (newMaintenanceMeta.maintenanceStatus === RoomMaintenanceStatus.OutOfService) {
            message = "This action means that the room requires some maintenance and you can't check in customers. Are you sure you want to mark the room as Out of Service?";
            title = "Out of Service";
        }

        var title = this._appContext.thTranslation.translate(title);
        var content = this._appContext.thTranslation.translate(message);
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                return this.updateMaintenanceStatus(resolve, reject, roomId, newMaintenanceMeta, newMaintenanceText);
            }, () => {
                resolve(null);
             });
    }

    private updateMaintenanceStatus(resolve: { (updatedRoom: RoomDO): void }, reject: { (err: ThError): void }, roomId: string, newMaintenanceMeta: RoomMaintenanceMeta, newMaintenanceText: string) {
        return this._hotelOperationsRoomService.updateMaintenanceStatus({
            id: roomId,
            maintenanceMessage: newMaintenanceText,
            maintenanceStatus: newMaintenanceMeta.maintenanceStatus
        }).subscribe((updatedRoom: RoomDO) => {
            this._appContext.analytics.logEvent("room", "maintenance-status", "Changed the maintenance status for a room");
            resolve(updatedRoom);
        }, (error: ThError) => {
            this._appContext.toaster.error(error.message);
            reject(error);
        });
    }

}