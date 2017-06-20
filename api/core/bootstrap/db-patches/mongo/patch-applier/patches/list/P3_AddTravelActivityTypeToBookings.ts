import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { TravelActivityType } from "../../../../../../data-layer/bookings/data-objects/BookingDO";

import _ = require('underscore');

export class P3_AddTravelActivityTypeToBookings extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._bookingRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddTravelActivityTypeToBookings;
    }

    protected updateDocumentInMemory(booking) {
        if (!_.isNumber(booking.travelActivityType)) {
            booking.travelActivityType = TravelActivityType.Leisure;
        }
    }
}
