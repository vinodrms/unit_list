import {RoomMaintenanceStatus} from '../../../rooms/data-objects/RoomDO';

export interface ChangeRoomMaintenanceStatusParam {
    id: string;
    maintenanceStatus: RoomMaintenanceStatus;
    maintenanceMessage: string;
}