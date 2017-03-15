import { MongoPatchType } from "../MongoPatchType";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { DynamicPriceDO } from "../../../../../../data-layer/price-products/data-objects/price/DynamicPriceDO";

import _ = require('underscore');

export class P8_AddDynamicPricesOnPriceProducts extends APaginatedTransactionalMongoPatch {
    public static DefaultDynamicPriceId = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddDynamicPricesOnPriceProducts;
    }

    protected getMongoRepository(): MongoRepository {
        return this._priceProductRepository;
    }

    protected updateDocumentInMemory(priceProduct) {
        P8_AddDynamicPricesOnPriceProducts.addDynamicPricesOnPriceProduct(priceProduct);
        priceProduct.versionId++;
    }

    public static addDynamicPricesOnPriceProduct(priceProduct) {
        if (!_.isArray(priceProduct.price.dynamicPriceList)) {

            let dynamicPrice = new DynamicPriceDO(priceProduct.price.type);
            dynamicPrice.id = P8_AddDynamicPricesOnPriceProducts.DefaultDynamicPriceId;
            dynamicPrice.name = "Default Pricing";
            dynamicPrice.description = "";
            dynamicPrice.priceList = priceProduct.price.priceList;
            dynamicPrice.priceExceptionList = priceProduct.price.priceExceptionList;

            priceProduct.price.dynamicPriceList = [dynamicPrice];
            priceProduct.price.enabledDynamicPriceIdByDate = {};
            delete priceProduct.price["priceList"];
            delete priceProduct.price["priceExceptionList"];
        }
    }
}