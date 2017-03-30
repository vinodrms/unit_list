import { BaseDO } from '../../../../../../common/base/BaseDO';
import { PriceProductConstraintWrapperDO } from "../constraint/PriceProductConstraintWrapperDO";
import { ThDateIntervalDO } from "../../../common/data-objects/th-dates/ThDateIntervalDO";

export class PriceProductDiscountDO extends BaseDO {
    name: string;
    value: number;
    constraints: PriceProductConstraintWrapperDO;
    customerIdList: string[];
    intervals: ThDateIntervalDO[];
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["name", "value", "customerIdList"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.constraints = new PriceProductConstraintWrapperDO();
        this.constraints.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "constraints"));

        this.intervals = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "intervals"), (intervalObject: Object) => {
			var dateIntervalDO = new ThDateIntervalDO();
			dateIntervalDO.buildFromObject(intervalObject);
			this.intervals.push(dateIntervalDO);
		});
    }

    public isValid(): boolean {
        if (!_.isString(this.name) || this.name.length == 0) {
            return false;
        }
        if (!_.isNumber(this.value) || this.value <= 0 && this.value > 1) {
            return false;
        }
        for (var i = 0; i < this.constraints.constraintList.length; i++) {
            let constraint = this.constraints.constraintList[i];
            if (!constraint.isValid()) {
                return false;
            }
        }
        return true;
    }

    public isPublic(): boolean {
        return !_.isArray(this.customerIdList) || this.customerIdList.length == 0;
    }
}