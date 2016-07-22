import {BookingMeta} from './BookingMeta';
import {BookingConfirmationStatus} from './BookingDO';
import {BookingIntervalEditRight} from './BookingEditRights';

export class BookingMetaFactory {
    public getBookingMetaList(): BookingMeta[] {
        return [
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.Confirmed,
                displayName: "Confirmed",
                intervalEditRight: BookingIntervalEditRight.EditInterval
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.Guaranteed,
                displayName: "Guaranteed",
                intervalEditRight: BookingIntervalEditRight.EditInterval
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.NoShow,
                displayName: "No Show",
                intervalEditRight: BookingIntervalEditRight.NoIntervalEdit
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.NoShowWithPenalty,
                displayName: "No Show With Penalty",
                intervalEditRight: BookingIntervalEditRight.NoIntervalEdit
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.Cancelled,
                displayName: "Cancelled",
                intervalEditRight: BookingIntervalEditRight.NoIntervalEdit
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.CheckedIn,
                displayName: "Checked In",
                intervalEditRight: BookingIntervalEditRight.EditEndDate
            }),
            new BookingMeta({
                confirmationStatus: BookingConfirmationStatus.CheckedOut,
                displayName: "Checked Out",
                intervalEditRight: BookingIntervalEditRight.NoIntervalEdit
            })
        ]
    }

    public getBookingMetaByStatus(confirmationStatus: BookingConfirmationStatus): BookingMeta {
        var bookingMetaList = this.getBookingMetaList();
        return _.find(bookingMetaList, (bookingMeta: BookingMeta) => { return bookingMeta.confirmationStatus === confirmationStatus });
    }
}