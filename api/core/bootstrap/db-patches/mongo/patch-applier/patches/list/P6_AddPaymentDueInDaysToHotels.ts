import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";

import _ = require('underscore');

export class P6_AddPaymentDueInDaysToHotels extends APaginatedTransactionalMongoPatch {

    private paymentDueInDays: number = 8;

    protected getMongoRepository(): MongoRepository {
        return this.hotelRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddPaymentDueInDaysToHotels;
    }

    protected updateDocumentInMemory(hotel) {
        if (this.thUtils.isUndefinedOrNull(hotel.paymentDueInDays)) {
            hotel.paymentDueInDays = this.paymentDueInDays;
        }
    }
}
