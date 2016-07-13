import {IBookingProcessStrategy, BookingStrategyMatchParams} from './IBookingProcessStrategy';
import {BookingSearchCriteriaRepoDO} from '../../../../data-layer/bookings/repositories/IBookingRepository';
import {BookingDO, BookingConfirmationStatus} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';

export class MarkBookingsAsNoShowStategy implements IBookingProcessStrategy {
    constructor() {
    }

    public getMatchingSearchCriteria(params: BookingStrategyMatchParams): BookingSearchCriteriaRepoDO {
        return {
            confirmationStatusList: [BookingConfirmationStatus.Confirmed, BookingConfirmationStatus.Guaranteed],
            triggerParams: {
                triggerName: BookingDO.NoShowTriggerName,
                cancellationHour: params.cancellationHour,
                currentHotelTimestamp: params.referenceTimestamp
            }
        };
    }

    public updateMatchedBooking(bookingDO: BookingDO) {
        switch (bookingDO.confirmationStatus) {
            case BookingConfirmationStatus.Confirmed:
                this.updateBookingAsNoShow(bookingDO);
                break;
            case BookingConfirmationStatus.Guaranteed:
                this.updateBookingAsNoShowWithPenalty(bookingDO);
                break;
            default:
                break;
        }
    }

    private updateBookingAsNoShow(bookingDO: BookingDO) {
        bookingDO.confirmationStatus = BookingConfirmationStatus.NoShow;
        bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "Booking was marked as No Show by the System"
        }));
    }
    private updateBookingAsNoShowWithPenalty(bookingDO: BookingDO) {
        bookingDO.confirmationStatus = BookingConfirmationStatus.NoShowWithPenalty;
        bookingDO.price = bookingDO.priceProductSnapshot.conditions.penalty.computePenaltyPrice(bookingDO.price);
        bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "Booking was marked as No Show by the System. The booking has a penalty on the attached invoice."
        }));
    }
}