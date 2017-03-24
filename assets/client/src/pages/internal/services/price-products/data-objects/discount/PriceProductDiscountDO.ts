import { BaseDO } from '../../../../../../common/base/BaseDO';
import { PriceProductConstraintWrapperDO } from "../constraint/PriceProductConstraintWrapperDO";

export class PriceProductDiscountDO extends BaseDO {
    name: string;
    value: number;
    constraints: PriceProductConstraintWrapperDO;
    customerIdList: string[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["name", "value", "customerIdList"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.constraints = new PriceProductConstraintWrapperDO();
        this.constraints.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "constraints"));
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