import { ThError } from '../../../../../../utils/th-responses/ThError';
import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { MongoUpdateMultipleDocuments } from '../../../../../../data-layer/common/base/mongo-utils/MongoUpdateMultipleDocuments';
import { PriceProductPriceType } from '../../../../../../data-layer/price-products/data-objects/price/IPriceProductPrice';

import async = require("async");

export class P2_SetValueForFirstChildWithAdultInSharedBedPriceOnPriceProducts extends ATransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.SetValueForFirstChildWithAdultInSharedBedPriceOnPriceProducts;
    }
    protected applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        var noUpdated = 0;
        async.doWhilst((finishSingleUpdateCallback) => {
            this._priceProductRepository.updateMultipleDocuments({
                "price.type": PriceProductPriceType.PricePerPerson,
                "price.priceList.firstChildWithAdultInSharedBedPrice": null
            },
                {
                    "price.priceList.$.firstChildWithAdultInSharedBedPrice": 0
                }, ((err: any) => {
                    finishSingleUpdateCallback(err);
                }), ((noUpdatedAtCurrentStep: number) => {
                    noUpdated = noUpdatedAtCurrentStep;
                    finishSingleUpdateCallback(null);
                }));
        }, () => {
            return noUpdated > 0;
        }, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    }
}