import { MongoPatchType } from "../MongoPatchType";
import { ThUtils } from "../../../../../../utils/ThUtils";
import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { PriceProductPriceType } from "../../../../../../data-layer/price-products/data-objects/price/IPriceProductPrice";

import _ = require('underscore');

export class P8_SetValueForFirstChildWithAdultInSharedBedPriceOnBookingsPriceProductSnapshots extends APaginatedTransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.SetValueForFirstChildWithAdultInSharedBedPriceOnBookingsPriceProductSnapshots;
    }

    protected getMongoRepository(): MongoRepository {
        return this._bookingRepository;
    }

    protected updateDocumentInMemory(bookingGroup) {
        var thUtils = new ThUtils();

        bookingGroup.bookingList.forEach(booking => {
            if (booking.priceProductSnapshot.price.type === PriceProductPriceType.PricePerPerson
                && _.isArray(booking.priceProductSnapshot.price.priceList)) {

                booking.priceProductSnapshot.price.priceList.forEach(price => {
                    if (!_.isNumber(price.firstChildWithAdultInSharedBedPrice)) {
                        price.firstChildWithAdultInSharedBedPrice = 0;
                    }
                });
            }
        });
        bookingGroup.versionId++;
    }
}