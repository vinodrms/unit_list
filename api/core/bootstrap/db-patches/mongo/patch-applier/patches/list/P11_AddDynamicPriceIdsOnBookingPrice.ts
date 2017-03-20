import { MongoPatchType } from "../MongoPatchType";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { P10_AddDynamicPricesOnPriceProducts } from "./P10_AddDynamicPricesOnPriceProducts";

import _ = require('underscore');

export class P11_AddDynamicPriceIdsOnBookingPrice extends APaginatedTransactionalMongoPatch {

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
                    pricePerNight.dynamicPriceId = P10_AddDynamicPricesOnPriceProducts.DefaultDynamicPriceId;
                }
                return pricePerNight;
            });
            P10_AddDynamicPricesOnPriceProducts.addDynamicPricesOnPriceProduct(booking.priceProductSnapshot);
        });
        bookingGroup.versionId++;
    }
}