import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { TravelType } from "../../../../../../data-layer/bookings/data-objects/BookingDO";

import _ = require('underscore');

export class P4_AddTravelTypeToBookings extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._bookingRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddTravelTypeToBookings;
    }

    protected updateDocumentInMemory(booking) {
        if (!_.isNumber(booking.travelType)) {
            booking.travelType = TravelType.Individual;
        }
    }
}
