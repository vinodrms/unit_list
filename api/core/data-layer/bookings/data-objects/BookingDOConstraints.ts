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
    public static ConfirmationStatuses_CanChangeCapacity: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn
    ];
    public static ConfirmationStatuses_CanAddPaymentGuarantee: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed
    ];
    public static ConfirmationStatuses_CanChangeDetails: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.NoShow,
        BookingConfirmationStatus.NoShowWithPenalty,
        BookingConfirmationStatus.CheckedIn
    ];
    public static ConfirmationStatuses_CanChangeCustomers: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn
    ];
    public static ConfirmationStatuses_CanChangeCustomerDisplayedOnInvoice: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn
    ];
    public static ConfirmationStatuses_CanCancel: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.NoShow,
        BookingConfirmationStatus.NoShowWithPenalty,
    ];
    public static ConfirmationStatuses_CanReactivate: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.NoShow,
        BookingConfirmationStatus.NoShowWithPenalty,
    ];
    public static ConfirmationStatuses_CanReserveAddOnProducts: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed
    ];
    public static ConfirmationStatuses_CanChangePriceProduct: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn
    ];
    public static ConfirmationStatuses_CanUndoCheckIn: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.CheckedIn
    ];

    public static ConfirmationStatuses_BookingsConsideredInYieldManager: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.NoShowWithPenalty,
        BookingConfirmationStatus.Cancelled,
        BookingConfirmationStatus.CheckedIn,
        BookingConfirmationStatus.CheckedOut
    ];

    public static ConfirmationStatuses_AddOnProductForbidDeletion: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.NoShow,
        BookingConfirmationStatus.NoShowWithPenalty
    ];

    public static ConfirmationStatuses_PriceProductForbidArchive: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.NoShow,
        BookingConfirmationStatus.NoShowWithPenalty,
        BookingConfirmationStatus.CheckedIn
    ];
}