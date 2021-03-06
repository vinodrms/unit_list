import { BookingPriceDO, BookingPriceType } from '../../../../../bookings/data-objects/price/BookingPriceDO';
import { ThUtils } from '../../../../../../utils/ThUtils';

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

        penaltyPrice.vatId = bookingPrice.vatId;

        penaltyPrice.priceType = BookingPriceType.Penalty;

        penaltyPrice.roomPricePerNightList = bookingPrice.roomPricePerNightList;
        penaltyPrice.roomPricePerNightAvg = this._thUtils.roundNumberToTwoDecimals(penaltyPriceToPay);
        penaltyPrice.numberOfNights = 1;
        penaltyPrice.totalRoomPrice = penaltyPrice.roomPricePerNightAvg;
        penaltyPrice.totalOtherPrice = 0.0;

        penaltyPrice.deductedCommissionPrice = bookingPrice.commissionSnapshot.getCommissionFor(penaltyPrice.totalRoomPrice);
        penaltyPrice.commissionSnapshot = bookingPrice.commissionSnapshot;

        penaltyPrice.totalBookingPrice = penaltyPrice.roomPricePerNightAvg - penaltyPrice.deductedCommissionPrice;

        penaltyPrice.breakfast = bookingPrice.breakfast;
        penaltyPrice.includedInvoiceItemList = bookingPrice.includedInvoiceItemList;

        return penaltyPrice;
    }
}