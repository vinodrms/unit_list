import { BaseDO } from "../../../../../../common/base/BaseDO";
import { ThUtils } from "../../../../../../common/utils/ThUtils";

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
        // transaction fee should also be positive; no matter if credit or debit
        let totalAmount = 
            this.type === TransactionFeeType.Fixed ? 
                amount + this.amount : amount + (Math.abs(amount) * this.amount);
        
        let thUtils = new ThUtils();
        return thUtils.roundNumberToTwoDecimals(totalAmount);
    }

    public static getDefaultTransactionFee(): TransactionFeeDO {
        let transactionFeeDO = new TransactionFeeDO();
        transactionFeeDO.amount = 0;
        transactionFeeDO.type = TransactionFeeType.Fixed;

        return transactionFeeDO;
    }
}