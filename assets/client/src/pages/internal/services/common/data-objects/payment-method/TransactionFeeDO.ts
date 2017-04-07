import { BaseDO } from "../../../../../../common/base/BaseDO";

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

public getAmountWihtTransactionFeeIncluded(amount: number): number {
        return this.type === TransactionFeeType.Fixed ? amount + this.amount : amount * (1 + this.amount);
    }
}