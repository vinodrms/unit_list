import { BaseDO } from '../../../common/base/BaseDO';
import { PriceProductConstraintWrapperDO } from "../constraint/PriceProductConstraintWrapperDO";
import { PriceProductConstraintDataDO } from "../constraint/IPriceProductConstraint";
import { ThDateIntervalDO } from "../../../../utils/th-dates/data-objects/ThDateIntervalDO";

import _ = require('underscore');
import { PriceProductDiscountIntervalWrapperDO } from "./PriceProductDiscountIntervalWrapperDO";

export interface DiscountConstraintDataDO extends PriceProductConstraintDataDO {
    bookingBilledCustomerId: string;
}

export class PriceProductDiscountDO extends BaseDO {
    name: string;
    value: number;
    constraints: PriceProductConstraintWrapperDO;
    intervals: PriceProductDiscountIntervalWrapperDO;
    
    // the list of customers that can use the discount
    // if empty => the discount is public
    customerIdList: string[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["name", "value", "customerIdList"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.constraints = new PriceProductConstraintWrapperDO();
        this.constraints.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "constraints"));

        this.intervals = new PriceProductDiscountIntervalWrapperDO();
        this.intervals.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "intervals"));
    }

    public appliesOn(data: DiscountConstraintDataDO): boolean {
        return this.constraints.appliesOn(data)
            && this.appliesOnCustomer(data.bookingBilledCustomerId);
    }
    private appliesOnCustomer(bookingBilledCustomerId: string): boolean {
        if (this.isPublic()) {
            return true;
        }
        if (!_.isString(bookingBilledCustomerId)) {
            return false;
        }
        return _.contains(this.customerIdList, bookingBilledCustomerId);
    }
    private isPublic(): boolean {
        return !_.isArray(this.customerIdList) || this.customerIdList.length == 0;
    }
}