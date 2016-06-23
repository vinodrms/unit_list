import {BookingConfirmationStatus} from './BookingDO';

export class BookingDOConstraints {
    public static NoBookingsLimit: number = 50;
    public static MaxBookingNoOfDays = 186;

    public static ConfirmationStatuses_OccupyingRoomsFromInventory: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn
    ];

    public static ConfirmationStatuses_BookingsConsideredInYieldManager: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn,
        BookingConfirmationStatus.CheckedOut
    ];
}