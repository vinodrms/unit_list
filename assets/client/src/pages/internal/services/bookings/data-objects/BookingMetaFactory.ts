import {BookingMeta} from './BookingMeta';
import {BookingConfirmationStatus} from './BookingDO';

export class BookingMetaFactory {
    public getBookingMetaList(): BookingMeta[] {
        return [
            {
                confirmationStatus: BookingConfirmationStatus.Confirmed,
                displayName: "Confirmed"
            },
            {
                confirmationStatus: BookingConfirmationStatus.Guaranteed,
                displayName: "Guaranteed"
            },
            {
                confirmationStatus: BookingConfirmationStatus.NoShow,
                displayName: "No Show"
            },
            {
                confirmationStatus: BookingConfirmationStatus.Cancelled,
                displayName: "Cancelled"
            },
            {
                confirmationStatus: BookingConfirmationStatus.CheckedIn,
                displayName: "Checked In"
            },
            {
                confirmationStatus: BookingConfirmationStatus.CheckedOut,
                displayName: "Checked Out"
            }
        ]
    }

    public getBookingMetaByStatus(confirmationStatus: BookingConfirmationStatus): BookingMeta {
        var bookingMetaList = this.getBookingMetaList();
        return _.find(bookingMetaList, (bookingMeta: BookingMeta) => { return bookingMeta.confirmationStatus === confirmationStatus });
    }
}