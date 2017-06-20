import { BookingConfirmationStatus } from './BookingDO';

export interface BookingMeta {
    status: BookingConfirmationStatus;
    name: string;
}

export class BookingDOConstraints {
    public static NoBookingsLimit: number = 50;
    public static MaxBookingNoOfDays = 186;
    public static MaxNoOfCompaniesOrTravelAgenciesOnBooking: number = 1;

    public static ConfirmationStatuses_All: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.NoShow,
        BookingConfirmationStatus.NoShowWithPenalty,
        BookingConfirmationStatus.Cancelled,
        BookingConfirmationStatus.CheckedIn,
        BookingConfirmationStatus.CheckedOut
    ];

    public static BookingMetaList: BookingMeta[] = [
        {
            status: BookingConfirmationStatus.Confirmed,
            name: "Confirmed"
        },

        {
            status: BookingConfirmationStatus.Guaranteed,
            name: "Guaranteed"
        },
        {
            status: BookingConfirmationStatus.NoShow,
            name: "No Show"
        },
        {
            status: BookingConfirmationStatus.NoShowWithPenalty,
            name: "No Show With Penalty"
        },
        {
            status: BookingConfirmationStatus.Cancelled,
            name: "Cancelled"
        },
        {
            status: BookingConfirmationStatus.CheckedIn,
            name: "Checked In"
        },
        {
            status: BookingConfirmationStatus.CheckedOut,
            name: "Checked Out"
        }
    ];

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
    public static ConfirmationStatuses_FixedArrivals: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn
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
    public static ConfirmationStatuses_FixedDepartures: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn,
        BookingConfirmationStatus.CheckedOut
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
    public static ConfirmationStatuses_CanChangeBilledCustomer: BookingConfirmationStatus[] = [
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

    public static ConfirmationStatuses_CountedInInventory: BookingConfirmationStatus[] = [
        BookingConfirmationStatus.Confirmed,
        BookingConfirmationStatus.Guaranteed,
        BookingConfirmationStatus.CheckedIn,
        BookingConfirmationStatus.CheckedOut,
        
    ]
}