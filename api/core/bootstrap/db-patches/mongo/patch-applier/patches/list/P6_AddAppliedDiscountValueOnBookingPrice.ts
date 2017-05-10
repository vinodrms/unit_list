import { ThError } from '../../../../../../utils/th-responses/ThError';
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from '../MongoPatchType';
import { APaginatedTransactionalMongoPatch } from '../../utils/APaginatedTransactionalMongoPatch';

import _ = require('underscore');

export class P6_AddAppliedDiscountValueOnBookingPrice extends APaginatedTransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddAppliedDiscountValueOnBookingPrice;
    }

    protected getMongoRepository(): MongoRepository {
        return this._legacyBookingGroupRepository;
    }

    protected updateDocumentInMemory(bookingGroup) {
        bookingGroup.bookingList.forEach(booking => {
            if (!_.isNumber(booking.price.appliedDiscountValue)) {
                booking.price.appliedDiscountValue = 0.0;
            }
        });
        bookingGroup.versionId++;
    }
}