import { MongoPatchType } from "../MongoPatchType";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { P8_AddDynamicPricesOnPriceProducts } from "./P8_AddDynamicPricesOnPriceProducts";

import _ = require('underscore');

export class P9_AddDynamicPriceIdsOnBookingPrice extends APaginatedTransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddDynamicPriceIdsOnBookingPrice;
    }

    protected getMongoRepository(): MongoRepository {
        return this._bookingRepository;
    }

    protected updateDocumentInMemory(bookingGroup) {
        bookingGroup.bookingList.forEach(booking => {
            booking.price.roomPricePerNightList = _.map(booking.price.roomPricePerNightList, (pricePerNight: any) => {
                if (this._thUtils.isUndefinedOrNull(pricePerNight.dynamicPriceId)) {
                    pricePerNight.dynamicPriceId = P8_AddDynamicPricesOnPriceProducts.DefaultDynamicPriceId;
                }
                return pricePerNight;
            });
            P8_AddDynamicPricesOnPriceProducts.addDynamicPricesOnPriceProduct(booking.priceProductSnapshot);
        });
        bookingGroup.versionId++;
    }
}