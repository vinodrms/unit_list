import { BookingMeta } from './BookingMeta';
import { BookingConfirmationStatus } from './BookingDO';
import {
    BookingIntervalEditRight, BookingNoShowEditRight, BookingAssignRoomRight,
    BookingCapacityEditRight, BookingPaymentGuaranteeEditRight, BookingDetailsEditRight,
    BookingCustomerEditRight, BookingCancelRight, BookingReactivateRight,
    BookingSendConfirmationRight, BookingReserveAddOnProductRight, BookingChangePriceProductRight,
    BookingUndoCheckInRight
} from './BookingEditRights';

export class BookingMetaFactory {
    public getBookingMetaList(): BookingMeta[] {
        return [
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.Confirmed,
                displayName: "Confirmed",
                intervalEditRight: BookingIntervalEditRight.EditInterval,
                noShowEditRight: BookingNoShowEditRight.Edit,
                assignRoomRight: BookingAssignRoomRight.Reserve,
                capacityEditRight: BookingCapacityEditRight.Edit,
                paymentGuaranteeEditRight: BookingPaymentGuaranteeEditRight.Edit,
                detailsEditRight: BookingDetailsEditRight.Edit,
                customerEditRight: BookingCustomerEditRight.Edit,
                cancelRight: BookingCancelRight.Cancel,
                reactivateRight: BookingReactivateRight.None,
                sendConfirmationRight: BookingSendConfirmationRight.Send,
                reserveAddOnProductRight: BookingReserveAddOnProductRight.Edit,
                changePriceProductRight: BookingChangePriceProductRight.Edit,
                undoCheckInRight: BookingUndoCheckInRight.None,
                displayClassName: "upcoming",
                fontName: "Z"
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.Guaranteed,
                displayName: "Guaranteed",
                intervalEditRight: BookingIntervalEditRight.EditInterval,
                noShowEditRight: BookingNoShowEditRight.Edit,
                assignRoomRight: BookingAssignRoomRight.Reserve,
                capacityEditRight: BookingCapacityEditRight.Edit,
                paymentGuaranteeEditRight: BookingPaymentGuaranteeEditRight.Edit,
                detailsEditRight: BookingDetailsEditRight.Edit,
                customerEditRight: BookingCustomerEditRight.Edit,
                cancelRight: BookingCancelRight.Cancel,
                reactivateRight: BookingReactivateRight.None,
                sendConfirmationRight: BookingSendConfirmationRight.Send,
                reserveAddOnProductRight: BookingReserveAddOnProductRight.Edit,
                changePriceProductRight: BookingChangePriceProductRight.Edit,
                undoCheckInRight: BookingUndoCheckInRight.None,
                displayClassName: "upcoming",
                fontName: "Z"
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.NoShow,
                displayName: "No Show",
                intervalEditRight: BookingIntervalEditRight.NoIntervalEdit,
                noShowEditRight: BookingNoShowEditRight.None,
                assignRoomRight: BookingAssignRoomRight.None,
                capacityEditRight: BookingCapacityEditRight.None,
                paymentGuaranteeEditRight: BookingPaymentGuaranteeEditRight.None,
                detailsEditRight: BookingDetailsEditRight.Edit,
                customerEditRight: BookingCustomerEditRight.None,
                cancelRight: BookingCancelRight.Cancel,
                reactivateRight: BookingReactivateRight.Reactivate,
                sendConfirmationRight: BookingSendConfirmationRight.None,
                reserveAddOnProductRight: BookingReserveAddOnProductRight.None,
                changePriceProductRight: BookingChangePriceProductRight.None,
                undoCheckInRight: BookingUndoCheckInRight.None,
                displayClassName: "noshow",
                fontName: "+"
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.NoShowWithPenalty,
                displayName: "No Show With Penalty",
                intervalEditRight: BookingIntervalEditRight.NoIntervalEdit,
                noShowEditRight: BookingNoShowEditRight.None,
                assignRoomRight: BookingAssignRoomRight.None,
                capacityEditRight: BookingCapacityEditRight.None,
                paymentGuaranteeEditRight: BookingPaymentGuaranteeEditRight.None,
                detailsEditRight: BookingDetailsEditRight.Edit,
                customerEditRight: BookingCustomerEditRight.None,
                cancelRight: BookingCancelRight.Cancel,
                reactivateRight: BookingReactivateRight.Reactivate,
                sendConfirmationRight: BookingSendConfirmationRight.None,
                reserveAddOnProductRight: BookingReserveAddOnProductRight.None,
                changePriceProductRight: BookingChangePriceProductRight.None,
                undoCheckInRight: BookingUndoCheckInRight.None,
                displayClassName: "noshow",
                fontName: "+"
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.Cancelled,
                displayName: "Cancelled",
                intervalEditRight: BookingIntervalEditRight.NoIntervalEdit,
                noShowEditRight: BookingNoShowEditRight.None,
                assignRoomRight: BookingAssignRoomRight.None,
                capacityEditRight: BookingCapacityEditRight.None,
                paymentGuaranteeEditRight: BookingPaymentGuaranteeEditRight.None,
                detailsEditRight: BookingDetailsEditRight.None,
                customerEditRight: BookingCustomerEditRight.None,
                cancelRight: BookingCancelRight.None,
                reactivateRight: BookingReactivateRight.None,
                sendConfirmationRight: BookingSendConfirmationRight.None,
                reserveAddOnProductRight: BookingReserveAddOnProductRight.None,
                changePriceProductRight: BookingChangePriceProductRight.None,
                undoCheckInRight: BookingUndoCheckInRight.None,
                displayClassName: "",
                fontName: "C"
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.CheckedIn,
                displayName: "Checked In",
                intervalEditRight: BookingIntervalEditRight.EditEndDate,
                noShowEditRight: BookingNoShowEditRight.None,
                assignRoomRight: BookingAssignRoomRight.Change,
                capacityEditRight: BookingCapacityEditRight.Edit,
                paymentGuaranteeEditRight: BookingPaymentGuaranteeEditRight.None,
                detailsEditRight: BookingDetailsEditRight.Edit,
                customerEditRight: BookingCustomerEditRight.Edit,
                cancelRight: BookingCancelRight.None,
                reactivateRight: BookingReactivateRight.None,
                sendConfirmationRight: BookingSendConfirmationRight.None,
                reserveAddOnProductRight: BookingReserveAddOnProductRight.None,
                changePriceProductRight: BookingChangePriceProductRight.Edit,
                undoCheckInRight: BookingUndoCheckInRight.Allowed,
                displayClassName: "checkedin",
                fontName: "("
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.CheckedOut,
                displayName: "Checked Out",
                intervalEditRight: BookingIntervalEditRight.NoIntervalEdit,
                noShowEditRight: BookingNoShowEditRight.None,
                assignRoomRight: BookingAssignRoomRight.None,
                capacityEditRight: BookingCapacityEditRight.None,
                paymentGuaranteeEditRight: BookingPaymentGuaranteeEditRight.None,
                detailsEditRight: BookingDetailsEditRight.None,
                customerEditRight: BookingCustomerEditRight.None,
                cancelRight: BookingCancelRight.None,
                reactivateRight: BookingReactivateRight.None,
                sendConfirmationRight: BookingSendConfirmationRight.None,
                reserveAddOnProductRight: BookingReserveAddOnProductRight.None,
                changePriceProductRight: BookingChangePriceProductRight.None,
                undoCheckInRight: BookingUndoCheckInRight.None,
                displayClassName: "checkedout",
                fontName: "*"
            })
        ]
    }

    public getBookingMetaByStatus(confirmationStatus: BookingConfirmationStatus): BookingMeta {
        var bookingMetaList = this.getBookingMetaList();
        return _.find(bookingMetaList, (bookingMeta: BookingMeta) => { return bookingMeta.confirmationStatus === confirmationStatus });
    }
}