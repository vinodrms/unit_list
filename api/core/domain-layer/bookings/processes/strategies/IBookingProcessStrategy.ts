import {BookingSearchCriteriaRepoDO} from '../../../../data-layer/bookings/repositories/IBookingRepository';
import {BookingDO, BookingConfirmationStatus} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import {ThHourDO} from '../../../../utils/th-dates/data-objects/ThHourDO';

export interface BookingStrategyMatchParams {
    cancellationHour: ThHourDO;
    referenceTimestamp: ThTimestampDO;
}

export interface IBookingProcessStrategy {
    getMatchingSearchCriteria(params: BookingStrategyMatchParams): BookingSearchCriteriaRepoDO;
    updateMatchedBooking(bookingDO: BookingDO, params: BookingStrategyMatchParams): Promise<BookingDO>;
}