import {ThUtils} from '../../../utils/ThUtils';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {ThTimestampDO} from '../../../utils/th-dates/data-objects/ThTimestampDO';
import {CustomersContainer} from '../../customers/validators/results/CustomersContainer';
import {BookingPriceDO, BookingPriceType} from '../../../data-layer/bookings/data-objects/price/BookingPriceDO';
import {IndexedBookingInterval} from '../../../data-layer/price-products/utils/IndexedBookingInterval';

import _ = require('underscore');

export class BookingUtils {
    private _thUtils: ThUtils;

    constructor() {
        this._thUtils = new ThUtils();
    }

    public getCurrentThDateForHotel(hotelDO: HotelDO): ThDateDO {
        var hotelTimestamp = this.getCurrentThTimestampForHotel(hotelDO);
        return hotelTimestamp.thDateDO;
    }
    public getCurrentThTimestampForHotel(hotelDO: HotelDO): ThTimestampDO {
        return ThTimestampDO.buildThTimestampForTimezone(hotelDO.timezone);
    }
    public updateIndexedSearchTerms(booking: BookingDO, customersContainer: CustomersContainer) {
        booking.indexedSearchTerms = [booking.groupBookingReference, booking.bookingReference];
        _.forEach(booking.customerIdList, (customerId: string) => {
            var customer = customersContainer.getCustomerById(customerId);
            if (!this._thUtils.isUndefinedOrNull(customer)) {
                booking.indexedSearchTerms.push(customer.customerDetails.getName());
            }
        });
    }
    public updateDisplayCustomerId(booking: BookingDO, customersContainer: CustomersContainer) {
        booking.displayCustomerId = booking.defaultBillingDetails.customerId;
        var customer = customersContainer.getCustomerById(booking.displayCustomerId);
        if (customer.isIndividual()) {
            return;
        }
        for (var custIndex = 0; custIndex < booking.customerIdList.length; custIndex++) {
            var currentCustomer = customersContainer.getCustomerById(booking.customerIdList[custIndex]);
            if (currentCustomer.isIndividual()) {
                booking.displayCustomerId = currentCustomer.id;
                return;
            }
        }
    }
    public updateBookingPriceUsingRoomCategory(bookingDO: BookingDO) {
        var indexedBookingInterval = new IndexedBookingInterval(bookingDO.interval);
        bookingDO.price = new BookingPriceDO();
        bookingDO.price.priceType = BookingPriceType.BookingStay;
        bookingDO.price.numberOfItems = indexedBookingInterval.getLengthOfStay();
        bookingDO.price.pricePerItem = bookingDO.priceProductSnapshot.price.getPricePerNightFor({
            configCapacity: bookingDO.configCapacity,
            roomCategoryId: bookingDO.roomCategoryId
        });
        bookingDO.price.totalPrice = bookingDO.price.numberOfItems * bookingDO.price.pricePerItem;
    }
}