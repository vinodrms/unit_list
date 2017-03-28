import { BaseDO } from '../../base/BaseDO';
import { NumberValidationRule } from "../../../../utils/th-validation/rules/NumberValidationRule";

export enum CommissionType {
    Fixed, Percentage
}

export class CommissionDO extends BaseDO {
    constructor() {
        super();
    }

    type: CommissionType;
    amount: number;
    deducted: boolean;

    protected getPrimitivePropertyKeys(): string[] {
        return ["type", "amount", "deducted"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
    }

    public isValid(): boolean {
        if (!this.deducted) {
            return true;
        }
        var numberValidationRule: NumberValidationRule;
        if (this.type === CommissionType.Fixed) {
            numberValidationRule = NumberValidationRule.buildPriceNumberRule();
        }
        else {
            numberValidationRule = NumberValidationRule.buildPercentageNumberRule();
        }
        return numberValidationRule.validate(this.amount).isValid();
    }
}