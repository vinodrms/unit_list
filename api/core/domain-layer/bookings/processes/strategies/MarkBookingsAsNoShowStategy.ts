import {IBookingProcessStrategy, BookingStrategyMatchParams} from './IBookingProcessStrategy';
import {BookingSearchCriteriaRepoDO} from '../../../../data-layer/bookings/repositories/IBookingRepository';
import {BookingDO, BookingConfirmationStatus} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import {BookingPriceType} from '../../../../data-layer/bookings/data-objects/price/BookingPriceDO';
import {BookingUtils} from '../../utils/BookingUtils';

export class MarkBookingsAsNoShowStategy implements IBookingProcessStrategy {
    private _bookingUtils: BookingUtils;

    constructor() {
        this._bookingUtils = new BookingUtils();
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

    public updateMatchedBooking(bookingDO: BookingDO, params: BookingStrategyMatchParams) {
        if (this.hasPenalty(bookingDO, params)) {
            this.updateBookingAsNoShowWithPenalty(bookingDO);
            return;
        }
        this.updateBookingAsNoShow(bookingDO);
    }

    private hasPenalty(bookingDO: BookingDO, params: BookingStrategyMatchParams): boolean {
        return this._bookingUtils.hasPenalty(bookingDO, {
            cancellationHour: params.cancellationHour,
            currentHotelTimestamp: params.referenceTimestamp
        });
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
        if (bookingDO.price.priceType === BookingPriceType.BookingStay) {
            bookingDO.price = bookingDO.priceProductSnapshot.conditions.penalty.computePenaltyPrice(bookingDO.price);
        }
        bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "Booking was marked as No Show by the System. The booking has a penalty on the attached invoice."
        }));
    }
}