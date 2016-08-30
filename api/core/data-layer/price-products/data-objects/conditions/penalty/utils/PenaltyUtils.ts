import {BookingPriceDO, BookingPriceType} from '../../../../../bookings/data-objects/price/BookingPriceDO';
import {ThUtils} from '../../../../../../utils/ThUtils';

export class PenaltyUtils {
    private _thUtils: ThUtils;

    constructor() {
        this._thUtils = new ThUtils();
    }

    public getPenaltyPrice(bookingPrice: BookingPriceDO, penaltyPriceToPay: number): BookingPriceDO {
        if (bookingPrice.priceType === BookingPriceType.Penalty) {
            return bookingPrice;
        }
        var penaltyPrice = new BookingPriceDO();

        penaltyPrice.movable = bookingPrice.movable;
        penaltyPrice.vatId = bookingPrice.vatId;

        penaltyPrice.priceType = BookingPriceType.Penalty;

        penaltyPrice.roomPricePerNight = this._thUtils.roundNumberToTwoDecimals(penaltyPriceToPay);
        penaltyPrice.numberOfNights = 1;
        penaltyPrice.totalRoomPrice = penaltyPrice.roomPricePerNight;
        penaltyPrice.totalOtherPrice = 0.0;

        penaltyPrice.totalBookingPrice = penaltyPrice.roomPricePerNight;

        penaltyPrice.breakfast = bookingPrice.breakfast;
        penaltyPrice.includedInvoiceItemList = bookingPrice.includedInvoiceItemList;

        return penaltyPrice;
    }
}