import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { ThError } from "../../../../../../utils/th-responses/ThError";

import _ = require('underscore');
import { ThDateDO } from "../../../../../../utils/th-dates/data-objects/ThDateDO";

export class P2_AddCreationDateUtcTimestampToBookings extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._bookingRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddCreationDateUtcTimestampToBookings;
    }

    protected updateDocumentInMemory(booking) {
        if (!_.isNumber(booking.creationDateUtcTimestamp)) {
            var creationDate: ThDateDO = new ThDateDO();
            creationDate.buildFromObject(booking.creationDate);
            booking.creationDateUtcTimestamp = creationDate.getUtcTimestamp();
        }
    }
}
