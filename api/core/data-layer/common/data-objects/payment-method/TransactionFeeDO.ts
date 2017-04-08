import { BaseDO } from "../../base/BaseDO";
import { NumberValidationRule } from "../../../../utils/th-validation/rules/NumberValidationRule";

export enum TransactionFeeType {
    Fixed, Percentage
}

export class TransactionFeeDO extends BaseDO {
    type: TransactionFeeType;
    amount: number;

    constructor() {
        super();
    }
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["type", "amount"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
    }

    public isValid(): boolean {
        var numberValidationRule: NumberValidationRule;
        if (this.type === TransactionFeeType.Fixed) {
            numberValidationRule = NumberValidationRule.buildPriceNumberRule();
        }
        else {
            numberValidationRule = NumberValidationRule.buildPercentageNumberRule();
        }
        return numberValidationRule.validate(this.amount, "amount").isValid();
    }

    public getAmountWihtTransactionFeeIncluded(amount: number): number {
        return this.type === TransactionFeeType.Fixed ? 
            amount + this.amount : amount * (1 + this.amount);
    }

    public static getDefaultTransactionFee(): TransactionFeeDO {
        let transactionFeeDO = new TransactionFeeDO();
        transactionFeeDO.amount = 0;
        transactionFeeDO.type = TransactionFeeType.Fixed;

        return transactionFeeDO;
    }
}