import { BaseDO } from '../../../common/base/BaseDO';
import { PriceProductDiscountDO, DiscountConstraintDataDO } from "./PriceProductDiscountDO";
import { PriceProductConstraintDataDO } from "../constraint/IPriceProductConstraint";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";

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

    /**
     * Returns the discount's value that satisfies all the constraints in the [0, 1] interval
     */
    public getDiscountValuesBreakdownFor(constraints: DiscountConstraintDataDO): number[] {
        let discountValuesBreakdown: number[] = [];
        
        let dateList = constraints.indexedBookingInterval.bookingDateList;
        _.forEach(dateList, (date: ThDateDO) => {
            let discountValue = 0.0;
            
            this.discountList.forEach(discount => {
                if (!discount.appliesOn(constraints)) {
                    return;
                }
                if (!discount.appliesOnDate(date)) {
                    return;
                }
                discountValue = Math.max(discountValue, discount.value);
            });

            discountValuesBreakdown.push(discountValue);    
        })
        return discountValuesBreakdown;
    }
}