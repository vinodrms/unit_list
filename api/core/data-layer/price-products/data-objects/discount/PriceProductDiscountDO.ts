import { BaseDO } from '../../../common/base/BaseDO';
import { PriceProductConstraintWrapperDO } from "../constraint/PriceProductConstraintWrapperDO";
import { PriceProductConstraintDataDO } from "../constraint/IPriceProductConstraint";

export class PriceProductDiscountDO extends BaseDO {
    name: string;
    value: number;
    constraints: PriceProductConstraintWrapperDO;

    protected getPrimitivePropertyKeys(): string[] {
        return ["name", "value"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.constraints = new PriceProductConstraintWrapperDO();
        this.constraints.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "constraints"));
    }

    public appliesOn(data: PriceProductConstraintDataDO): boolean {
        return this.constraints.appliesOn(data);
    }
}