import {BookingConfirmationStatus} from './BookingDO';

export class BookingDOConstraints {
    public static NoBookingsLimit: number = 50;
    public static MaxBookingNoOfDays = 186;
    public static MaxNoOfCompaniesOrTravelAgenciesOnBooking: number = 1;

    public static ConfirmationStatuses_OccupyingRoomsFromInventory: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn
    ];
    public static ConfirmationStatuses_CheckedId: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.CheckedIn
    ];
    public static ConfirmationStatuses_CanBeCheckedIn: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed
    ];
    public static ConfirmationStatuses_NoShow: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.NoShow,
        BookingConfirmationStatus.NoShowWithPenalty
    ];
    public static ConfirmationStatuses_ShowInDepartures: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn
    ];
    public static ConfirmationStatuses_CanChangeDates: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn
    ];
    public static ConfirmationStatuses_CanChangeNoShowTime: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed
    ];

    public static ConfirmationStatuses_BookingsConsideredInYieldManager: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn,
        BookingConfirmationStatus.CheckedOut
    ];
}