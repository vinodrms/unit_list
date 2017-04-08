import { BaseDO } from "../../../../../../common/base/BaseDO";
import { TransactionFeeDO } from "./TransactionFeeDO";

export class PaymentMethodInstanceDO extends BaseDO {
    paymentMethodId: string;
    transactionFee: TransactionFeeDO;

    constructor() {
        super();
    }
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["paymentMethodId"];
    }

    public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.transactionFee = new TransactionFeeDO();
		this.transactionFee.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "transactionFee"));
	}
}