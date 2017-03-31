import { BaseDO } from '../../base/BaseDO';
import { NumberValidationRule } from "../../../../utils/th-validation/rules/NumberValidationRule";
import { ThUtils } from "../../../../utils/ThUtils";

import _ = require('underscore');

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

    public getCommissionFor(price: number): number {
        // does not apply commission if it's not deducted
        if (!this.deducted) { return 0.0; }

        // does not apply commission if it does not have a valid amount
        if (!_.isNumber(this.amount) || this.amount <= 0) {
            return 0.0;
        }

        let commission = this.amount;
        if (this.type === CommissionType.Percentage) {
            commission = this.amount * price;
        }

        let thUtils = new ThUtils();
        return thUtils.roundNumberToTwoDecimals(commission);
    }
}