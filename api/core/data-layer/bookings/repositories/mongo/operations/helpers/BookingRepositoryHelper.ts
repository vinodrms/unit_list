
import { BookingDO } from "../../../../data-objects/BookingDO";

export class BookingRepositoryHelper {
    public buildBookingDOFrom(dbBooking: Object): BookingDO {
        var booking: BookingDO = new BookingDO();
        booking.buildFromObject(dbBooking);
        return booking;
    }
    public buildBookingListFrom(dbBookingList: Array<Object>): BookingDO[] {
        var list: BookingDO[] = [];
        dbBookingList.forEach((dbBooking: Object) => {
            list.push(this.buildBookingDOFrom(dbBooking));
        });
        return list;
    }
}