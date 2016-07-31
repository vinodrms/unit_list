import {BookingConfirmationStatus} from './BookingDO';

export class BookingDOConstraints {
    public static NoBookingsLimit: number = 50;
    public static MaxNoOfCompaniesOrTravelAgenciesOnBooking: number = 1;

    public static ConfirmationStatuses_CheckedId: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.CheckedIn
    ];
}