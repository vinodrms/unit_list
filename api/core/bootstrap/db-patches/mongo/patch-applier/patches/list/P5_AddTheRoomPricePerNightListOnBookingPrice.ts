import { ThError } from '../../../../../../utils/th-responses/ThError';
import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { ABookingGroupTransactionalMongoPatch } from '../../utils/ABookingGroupTransactionalMongoPatch';
import { BookingPriceType } from '../../../../../../data-layer/bookings/data-objects/price/BookingPriceDO';
import { PricePerDayDO } from '../../../../../../data-layer/bookings/data-objects/price/PricePerDayDO';
import { IndexedBookingInterval } from '../../../../../../data-layer/price-products/utils/IndexedBookingInterval';
import { ThDateIntervalDO } from '../../../../../../utils/th-dates/data-objects/ThDateIntervalDO';

import _ = require('underscore');

export class P5_AddTheRoomPricePerNightListOnBookingPrice extends ABookingGroupTransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddTheRoomPricePerNightListOnBookingPrice;
    }

    protected updateBookingGroupInMemory(bookingGroup) {
        bookingGroup.bookingList.forEach(booking => {
            if (_.isNumber(booking.price.roomPricePerNight)) {
                booking.price.roomPricePerNightAvg = booking.price.roomPricePerNight;
                delete booking.price["roomPricePerNight"];
                booking.price.roomPricePerNightList = [];

                if (booking.price.priceType === BookingPriceType.BookingStay) {
                    let priceList = [];
                    for (var i = 0; i < booking.price.numberOfNights; i++) {
                        priceList.push(booking.price.roomPricePerNightAvg);
                    }
                    let bookingInterval = new ThDateIntervalDO();
                    bookingInterval.buildFromObject(booking.interval);
                    let indexedBookingInterval = new IndexedBookingInterval(bookingInterval);
                    booking.price.roomPricePerNightList = PricePerDayDO.buildPricePerDayList(indexedBookingInterval.bookingDateList, priceList);
                }
            }
        });
        bookingGroup.versionId++;
    }
}