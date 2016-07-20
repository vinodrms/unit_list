import {AHotelOperationsPageParam} from '../../../../../services/utils/AHotelOperationsPageParam';
import {HotelOperationsPageType} from '../../../../../services/utils/HotelOperationsPageType';

export class HotelBookingOperationsPageParam extends AHotelOperationsPageParam {
    private static BookingFontName = "E";
    groupBookingId: string;
    bookingId: string;

    constructor() {
        super(HotelOperationsPageType.BookingOperations, HotelBookingOperationsPageParam.BookingFontName);
    }
}