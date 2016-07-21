import {RoomMaintenanceStatus} from '../data-objects/RoomDO';

export class RoomMaintenanceMeta {
    maintenanceStatus: RoomMaintenanceStatus;
    maintenanceMessage: string;
    fontName: string;

    public buildPrototype(): RoomMaintenanceMeta {
        return RoomMaintenanceMeta.buildRoomMaintenanceMeta(this.maintenanceStatus, this.maintenanceMessage, this.fontName);
    }

    public static buildRoomMaintenanceMeta(maintenanceStatus: RoomMaintenanceStatus, maintenanceMessage: string, fontName: string): RoomMaintenanceMeta {
        var maintenanceMeta = new RoomMaintenanceMeta();
        maintenanceMeta.maintenanceStatus = maintenanceStatus;
        maintenanceMeta.maintenanceMessage = maintenanceMessage;
        maintenanceMeta.fontName = fontName;
        return maintenanceMeta;
    }
}