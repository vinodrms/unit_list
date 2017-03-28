import { BaseDO } from "../../base/BaseDO";

export class PaymentMethodInstanceDO extends BaseDO {
    paymentMethodId: string;
    transactionFee: number;

    constructor() {
        super();
    }
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["paymentMethodId", "transactionFee"];
    }
}