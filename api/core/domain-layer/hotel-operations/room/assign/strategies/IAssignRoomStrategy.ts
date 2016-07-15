import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {ThTimestampDO} from '../../../../../utils/th-dates/data-objects/ThTimestampDO';
import {AssignRoomDO} from '../AssignRoomDO';
import {RoomDO} from '../../../../../data-layer/rooms/data-objects/RoomDO';

export interface AssignRoomValidationDO {
    booking: BookingDO;
    assignRoomDO: AssignRoomDO;
    currentHotelTimestamp: ThTimestampDO;
    roomList: RoomDO[];
}

export interface IAssignRoomStrategy {
    updateAdditionalFields(validationDO: AssignRoomValidationDO): Promise<BookingDO>;
}