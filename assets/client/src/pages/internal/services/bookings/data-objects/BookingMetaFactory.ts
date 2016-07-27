import {BookingMeta} from './BookingMeta';
import {BookingConfirmationStatus} from './BookingDO';
import {BookingIntervalEditRight, BookingNoShowEditRight, BookingAssignRoomRight, BookingCapacityEditRight} from './BookingEditRights';

export class BookingMetaFactory {
    public getBookingMetaList(): BookingMeta[] {
        return [
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.Confirmed,
                displayName: "Confirmed",
                intervalEditRight: BookingIntervalEditRight.EditInterval,
                noShowEditRight: BookingNoShowEditRight.EditNoShow,
                assignRoomRight: BookingAssignRoomRight.Reserve,
                capacityEditRight: BookingCapacityEditRight.EditCapacity,
                displayClassName: "upcoming",
                fontName: "Z"
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.Guaranteed,
                displayName: "Guaranteed",
                intervalEditRight: BookingIntervalEditRight.EditInterval,
                noShowEditRight: BookingNoShowEditRight.EditNoShow,
                assignRoomRight: BookingAssignRoomRight.Reserve,
                capacityEditRight: BookingCapacityEditRight.EditCapacity,
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
                displayClassName: "",
                fontName: "C"
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.CheckedIn,
                displayName: "Checked In",
                intervalEditRight: BookingIntervalEditRight.EditEndDate,
                noShowEditRight: BookingNoShowEditRight.None,
                assignRoomRight: BookingAssignRoomRight.Change,
                capacityEditRight: BookingCapacityEditRight.EditCapacity,
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