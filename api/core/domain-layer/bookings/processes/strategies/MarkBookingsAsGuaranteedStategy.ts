import {IBookingProcessStrategy, BookingStrategyMatchParams} from './IBookingProcessStrategy';
import {BookingSearchCriteriaRepoDO} from '../../../../data-layer/bookings/repositories/IBookingRepository';
import {BookingDO, BookingConfirmationStatus} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';

export class MarkBookingsAsGuaranteedStategy implements IBookingProcessStrategy {
    constructor() {
    }

    public getMatchingSearchCriteria(params: BookingStrategyMatchParams): BookingSearchCriteriaRepoDO {
        return {
            confirmationStatusList: [BookingConfirmationStatus.Confirmed],
            triggerParams: {
                triggerName: BookingDO.GuaranteedTriggerName,
                cancellationHour: params.cancellationHour,
                currentHotelTimestamp: params.referenceTimestamp
            }
        };
    }

    public updateMatchedBooking(bookingDO: BookingDO, params: BookingStrategyMatchParams) {
        if (bookingDO.confirmationStatus !== BookingConfirmationStatus.Confirmed || !bookingDO.priceProductSnapshot.conditions.policy.hasCancellationPolicy()) {
            return;
        }
        bookingDO.confirmationStatus = BookingConfirmationStatus.Guaranteed;
        bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "Booking was marked as Guaranteed by the System"
        }));
    }
}