import { BaseDO } from '../../../../../../common/base/BaseDO';
import { PriceProductDiscountDO } from "./PriceProductDiscountDO";

import _ = require('underscore');

export class PriceProductDiscountWrapperDO extends BaseDO {
    discountList: PriceProductDiscountDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.discountList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "discountList"), (discountObject: Object) => {
            var discountDO = new PriceProductDiscountDO();
            discountDO.buildFromObject(discountObject);
            this.discountList.push(discountDO);
        });
    }
}