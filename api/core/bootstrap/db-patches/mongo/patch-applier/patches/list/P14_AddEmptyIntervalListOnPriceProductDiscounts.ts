import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { PriceProductDiscountDO } from "../../../../../../data-layer/price-products/data-objects/discount/PriceProductDiscountDO";

import _ = require('underscore');

export class P14_AddEmptyIntervalListOnPriceProductDiscounts extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._priceProductRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddEmptyIntervalListOnPriceProductDiscounts;
    }

    protected updateDocumentInMemory(priceProduct) {
        P14_AddEmptyIntervalListOnPriceProductDiscounts.addEmptyIntervalListOnDiscounts(priceProduct);
        priceProduct.versionId++;
    }

    public static addEmptyIntervalListOnDiscounts(priceProduct) {
        if (!_.isObject(priceProduct.discounts)) {
            priceProduct.discounts = {
                discountList: []
            };
        }
        if (_.isArray(priceProduct.discounts.discountList)) {
            _.forEach(priceProduct.discounts.discountList, (discount: any) => {
                if (_.isUndefined(discount.intervals)) {
                    discount.intervals = {
                        "intervalList": []
                    };
                }
            });
        }
    }
}