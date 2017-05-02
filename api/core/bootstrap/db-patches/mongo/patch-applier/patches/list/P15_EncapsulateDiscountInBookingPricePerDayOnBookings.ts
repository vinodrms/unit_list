import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";

import _ = require('underscore');
import { BookingDO } from "../../../../../../data-layer/bookings/data-objects/BookingDO";
import { PricePerDayDO } from "../../../../../../data-layer/bookings/data-objects/price/PricePerDayDO";
import { BookingGroupDO } from "../../../../../../data-layer/bookings/repositories/mongo-legacy/utils/data-objects/BookingGroupDO";

export class P15_EncapsulateDiscountInBookingPricePerDayOnBookings extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._legacyBookingGroupRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.EncapsulateDiscountInBookingPricePerDayOnBookings;
    }

    protected updateDocumentInMemory(booking) {
        P15_EncapsulateDiscountInBookingPricePerDayOnBookings.encapsulateDiscountInPricePerDay(booking);
        booking.versionId++;
    }

    public static encapsulateDiscountInPricePerDay(bookingGroup: BookingGroupDO) {
        _.forEach(bookingGroup.bookingList, (booking: BookingDO) => {
            let appliedDiscount = booking.price["appliedDiscountValue"];
            if (_.isNumber(appliedDiscount)) {
                delete booking.price["appliedDiscountValue"];
                _.forEach(booking.price.roomPricePerNightList, (pricePerDay: PricePerDayDO) => {
                    pricePerDay.discount = appliedDiscount;
                });
            }
        });
    }
}