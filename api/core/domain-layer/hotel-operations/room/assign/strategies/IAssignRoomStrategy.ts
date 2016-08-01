import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {ThTimestampDO} from '../../../../../utils/th-dates/data-objects/ThTimestampDO';
import {AssignRoomDO} from '../AssignRoomDO';
import {RoomDO} from '../../../../../data-layer/rooms/data-objects/RoomDO';
import {RoomCategoryStatsDO} from '../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';

export interface AssignRoomValidationDO {
    booking: BookingDO;
    assignRoomDO: AssignRoomDO;
    currentHotelTimestamp: ThTimestampDO;
    roomList: RoomDO[];
    roomCategoryStatsList: RoomCategoryStatsDO[];
}

export interface IAssignRoomStrategy {
    updateAdditionalFields(validationDO: AssignRoomValidationDO): Promise<BookingDO>;
    validateAlreadyCheckedInBooking(): boolean;
    generateInvoiceIfNecessary(booking: BookingDO): Promise<BookingDO>;
}