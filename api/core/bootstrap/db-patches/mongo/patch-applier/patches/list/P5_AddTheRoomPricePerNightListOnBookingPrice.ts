import { ThError } from '../../../../../../utils/th-responses/ThError';
import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { ABookingGroupTransactionalMongoPatch } from '../../utils/ABookingGroupTransactionalMongoPatch';
import { BookingPriceType } from '../../../../../../data-layer/bookings/data-objects/price/BookingPriceDO';
import { PricePerDayDO } from '../../../../../../data-layer/bookings/data-objects/price/PricePerDayDO';
import { IndexedBookingInterval } from '../../../../../../data-layer/price-products/utils/IndexedBookingInterval';
import { ThDateIntervalDO } from '../../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from "../../../../../../utils/th-dates/data-objects/ThDateDO";

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

                let priceList = [];
                for (var i = 0; i < booking.price.numberOfNights; i++) {
                    priceList.push(booking.price.roomPricePerNightAvg);
                }
                let bookingInterval = new ThDateIntervalDO();
                bookingInterval.buildFromObject(booking.interval);
                let indexedBookingInterval = new IndexedBookingInterval(bookingInterval);
                booking.price.roomPricePerNightList = this.buildPricePerDayList(indexedBookingInterval.bookingDateList, priceList);
            }
        });
        bookingGroup.versionId++;
    }
    private buildPricePerDayList(thDateList: ThDateDO[], priceList: number[]): PricePerDayDO[] {
        let pricePerDayList: PricePerDayDO[] = [];
        let length = Math.min(thDateList.length, priceList.length);
        for (var i = 0; i < length; i++) {
            let pricePerDay = new PricePerDayDO();
            pricePerDay.thDate = thDateList[i];
            pricePerDay.price = priceList[i];
            pricePerDayList.push(pricePerDay);
        }
        return pricePerDayList;
    }
}