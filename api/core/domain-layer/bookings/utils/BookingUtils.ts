import {ThUtils} from '../../../utils/ThUtils';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {ThTimestampDO} from '../../../utils/th-dates/data-objects/ThTimestampDO';
import {CustomersContainer} from '../../customers/validators/results/CustomersContainer';

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
}