import { MongoPatchType } from "../MongoPatchType";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { DynamicPriceDO } from "../../../../../../data-layer/price-products/data-objects/price/DynamicPriceDO";
import { CommissionDO, CommissionType } from "../../../../../../data-layer/common/data-objects/commission/CommissionDO";

import _ = require('underscore');

export class P13_AddDeductedCommissionPriceAndEmptyCommissionOnBookingPrice extends APaginatedTransactionalMongoPatch {


    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddDeductedCommissionPriceAndEmptyCommissionOnBookingPrice;
    }

    protected getMongoRepository(): MongoRepository {
        return this._bookingRepository;
    }

    protected updateDocumentInMemory(bookingGroup) {
        bookingGroup.bookingList.forEach(booking => {
            if (!_.isNumber(booking.price.deductedCommissionPrice)) {
                booking.price.deductedCommissionPrice = 0.0;
                booking.price.commissionSnapshot = new CommissionDO();
                booking.price.commissionSnapshot.type = CommissionType.Fixed;
                booking.price.commissionSnapshot.amount = 0.0;
                booking.price.commissionSnapshot.deducted = false;
            }
        });
        bookingGroup.versionId++;
    }
}