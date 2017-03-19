import { MongoPatchType } from "../MongoPatchType";
import { ABookingGroupTransactionalMongoPatch } from "../../utils/ABookingGroupTransactionalMongoPatch";
import { ThUtils } from "../../../../../../utils/ThUtils";
import { PriceProductPriceType } from "../../../../../../data-layer/price-products/data-objects/price/IPriceProductPrice";

import _ = require('underscore');

export class P8_SetValueForFirstChildWithAdultInSharedBedPriceOnBookingsPriceProductSnapshots extends ABookingGroupTransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.SetValueForFirstChildWithAdultInSharedBedPriceOnBookingsPriceProductSnapshots;
    }

    protected updateBookingGroupInMemory(bookingGroup) {
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