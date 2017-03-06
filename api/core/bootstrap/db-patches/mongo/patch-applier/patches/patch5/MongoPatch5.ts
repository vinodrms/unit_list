import { ThError } from '../../../../../../utils/th-responses/ThError';
import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { ABookingGroupTransactionalMongoPatch } from '../../utils/ABookingGroupTransactionalMongoPatch';
import { BookingPriceType } from '../../../../../../data-layer/bookings/data-objects/price/BookingPriceDO';

import _ = require('underscore');

export class MongoPatch5 extends ABookingGroupTransactionalMongoPatch {

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
                    for (var i = 0; i < booking.price.numberOfNights; i++) {
                        booking.price.roomPricePerNightList.push(booking.price.roomPricePerNightAvg);
                    }
                }
            }
        });
        bookingGroup.versionId++;
    }
}