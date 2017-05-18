import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { ThError } from "../../../../../../utils/th-responses/ThError";
import { BookingConfirmationStatus } from "../../../../../../data-layer/bookings/data-objects/BookingDO";

import _ = require('underscore');

export class P27_AddCheckInAndCheckOutUtcTimestampsOnBookings extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._bookingRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddCheckInAndCheckOutUtcTimestampsOnBookings;
    }

    protected updateDocumentInMemory(booking) {
        if (!_.isNumber(booking.checkInUtcTimestamp)) {
            if (booking.confirmationStatus === BookingConfirmationStatus.CheckedIn
                || booking.confirmationStatus === BookingConfirmationStatus.CheckedOut) {
                booking.checkInUtcTimestamp = booking.startUtcTimestamp;
            }
        }

        if (!_.isNumber(booking.checkOutUtcTimestamp)) {
            if (booking.confirmationStatus === BookingConfirmationStatus.CheckedOut) {
                booking.checkOutUtcTimestamp = booking.endUtcTimestamp;
            }
        }
    }
}