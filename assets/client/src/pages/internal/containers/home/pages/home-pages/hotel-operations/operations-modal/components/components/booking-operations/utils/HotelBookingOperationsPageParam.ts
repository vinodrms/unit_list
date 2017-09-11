import { AHotelOperationsPageParam } from '../../../../services/utils/AHotelOperationsPageParam';
import { HotelOperationsPageType } from '../../../../services/utils/HotelOperationsPageType';

export class HotelBookingOperationsPageParam extends AHotelOperationsPageParam {
    private static BookingFontName = "E";

    constructor(public bookingId: string) {
        super(HotelOperationsPageType.BookingOperations, HotelBookingOperationsPageParam.BookingFontName);
    }
}
