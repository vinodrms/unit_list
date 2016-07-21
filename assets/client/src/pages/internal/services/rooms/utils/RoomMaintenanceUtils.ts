import {RoomMaintenanceStatus} from '../data-objects/RoomDO';
import {RoomMaintenanceMeta} from './RoomMaintenanceMeta';

export class RoomMaintenanceUtils {
    private _maintenanceMetaList: RoomMaintenanceMeta[];

    constructor() {
        this.buildMaintenanceMetaList();
    }

    private buildMaintenanceMetaList() {
        this._maintenanceMetaList = [
            RoomMaintenanceMeta.buildRoomMaintenanceMeta(RoomMaintenanceStatus.Clean, "Clean", ","),
            RoomMaintenanceMeta.buildRoomMaintenanceMeta(RoomMaintenanceStatus.Dirty, "Dirty", ","),
            RoomMaintenanceMeta.buildRoomMaintenanceMeta(RoomMaintenanceStatus.PickUp, "Pick Up", ","),
            RoomMaintenanceMeta.buildRoomMaintenanceMeta(RoomMaintenanceStatus.OutOfOrder, "Out Of Order", ","),
            RoomMaintenanceMeta.buildRoomMaintenanceMeta(RoomMaintenanceStatus.OutOfService, "Out Of Service", ","),
        ];
    }

    public getRoomMaintenanceMetaList(): RoomMaintenanceMeta[] {
        return this._maintenanceMetaList;
    }

    public getRoomMaintenanceMetaByStatus(roomMaintenanceStatusToFind: RoomMaintenanceStatus): RoomMaintenanceMeta {
        return _.find(this._maintenanceMetaList, (maintenanceMeta: RoomMaintenanceMeta) => {
            return maintenanceMeta.maintenanceStatus === roomMaintenanceStatusToFind;
        });
    }
}