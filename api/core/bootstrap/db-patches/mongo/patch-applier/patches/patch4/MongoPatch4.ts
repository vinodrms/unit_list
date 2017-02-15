import { ThError } from '../../../../../../utils/th-responses/ThError';
import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { ABookingGroupTransactionalMongoPatch } from '../../utils/ABookingGroupTransactionalMongoPatch';

import _ = require('underscore');

export class MongoPatch4 extends ABookingGroupTransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.SetTheNoBabyBedsOnBookingsCapacity;
    }

    protected updateBookingGroupInMemory(bookingGroup) {
        bookingGroup.bookingList.forEach(booking => {
            if (!_.isNumber(booking.configCapacity.noBabyBeds)) {
                booking.configCapacity.noBabyBeds = booking.configCapacity.noBabies;
                booking.configCapacity.noBabies = 0;
            }
        });
        bookingGroup.versionId++;
    }
}