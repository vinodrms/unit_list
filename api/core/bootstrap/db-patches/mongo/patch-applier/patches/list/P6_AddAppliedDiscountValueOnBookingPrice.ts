import { ThError } from '../../../../../../utils/th-responses/ThError';
import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { ABookingGroupTransactionalMongoPatch } from '../../utils/ABookingGroupTransactionalMongoPatch';
import { BookingPriceType } from '../../../../../../data-layer/bookings/data-objects/price/BookingPriceDO';
import { PricePerDayDO } from '../../../../../../data-layer/bookings/data-objects/price/PricePerDayDO';
import { IndexedBookingInterval } from '../../../../../../data-layer/price-products/utils/IndexedBookingInterval';
import { ThDateIntervalDO } from '../../../../../../utils/th-dates/data-objects/ThDateIntervalDO';

import _ = require('underscore');

export class P6_AddAppliedDiscountValueOnBookingPrice extends ABookingGroupTransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddAppliedDiscountValueOnBookingPrice;
    }

    protected updateBookingGroupInMemory(bookingGroup) {
        bookingGroup.bookingList.forEach(booking => {
            if (!_.isNumber(booking.price.appliedDiscountValue)) {
                booking.price.appliedDiscountValue = 0.0;
            }
        });
        bookingGroup.versionId++;
    }
}