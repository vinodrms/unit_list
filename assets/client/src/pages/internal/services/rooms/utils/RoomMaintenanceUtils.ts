import {RoomMaintenanceStatus} from '../data-objects/RoomDO';
import {RoomMaintenanceMeta} from './RoomMaintenanceMeta';

import * as _ from "underscore";

export class RoomMaintenanceUtils {
    private _maintenanceMetaList: RoomMaintenanceMeta[];

    constructor() {
        this.buildMaintenanceMetaList();
    }

    private buildMaintenanceMetaList() {
        this._maintenanceMetaList = [
            RoomMaintenanceMeta.buildRoomMaintenanceMeta(RoomMaintenanceStatus.Clean, "Clean", "Z"),
            RoomMaintenanceMeta.buildRoomMaintenanceMeta(RoomMaintenanceStatus.Dirty, "Dirty", "H"),
            RoomMaintenanceMeta.buildRoomMaintenanceMeta(RoomMaintenanceStatus.PickUp, "Pick Up", "J"),
            RoomMaintenanceMeta.buildRoomMaintenanceMeta(RoomMaintenanceStatus.OutOfService, "Out Of Service", "K"),
            RoomMaintenanceMeta.buildRoomMaintenanceMeta(RoomMaintenanceStatus.OutOfOrder, "Out Of Order", "+")
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