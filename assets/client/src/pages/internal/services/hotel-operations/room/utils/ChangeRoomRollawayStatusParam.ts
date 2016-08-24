import {RollawayBedStatus} from '../../../rooms/data-objects/RoomDO';

export interface ChangeRoomRollawayStatusParam {
    id: string;
    rollawayBedStatus: RollawayBedStatus;
}