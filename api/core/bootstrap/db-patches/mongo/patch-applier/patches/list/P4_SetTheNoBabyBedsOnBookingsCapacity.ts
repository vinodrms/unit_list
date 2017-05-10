import { ThError } from '../../../../../../utils/th-responses/ThError';
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { APaginatedTransactionalMongoPatch } from '../../utils/APaginatedTransactionalMongoPatch';

import _ = require('underscore');

export class P4_SetTheNoBabyBedsOnBookingsCapacity extends APaginatedTransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.SetTheNoBabyBedsOnBookingsCapacity;
    }

    protected getMongoRepository(): MongoRepository {
        return this._legacyBookingGroupRepository;
    }

    protected updateDocumentInMemory(bookingGroup) {
        bookingGroup.bookingList.forEach(booking => {
            if (!_.isNumber(booking.configCapacity.noBabyBeds)) {
                booking.configCapacity.noBabyBeds = booking.configCapacity.noBabies;
                booking.configCapacity.noBabies = 0;
            }
        });
        bookingGroup.versionId++;
    }
}