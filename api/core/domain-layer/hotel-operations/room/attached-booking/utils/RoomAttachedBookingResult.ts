import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';

export enum RoomAttachedBookingResultType {
    NoBooking,
    CheckedInBooking,
    ReservedBooking
}

export class RoomAttachedBookingResult {
    resultType: RoomAttachedBookingResultType;
    booking: BookingDO;

    constructor(resultType: RoomAttachedBookingResultType, booking?: BookingDO) {
        this.resultType = resultType;
        this.booking = booking;
    }
}