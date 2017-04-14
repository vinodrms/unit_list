import { BaseDO } from "../../../../../../common/base/BaseDO";
import { PaymentMethodDO } from "./PaymentMethodDO";
import { TransactionFeeDO } from "./TransactionFeeDO";

export class AggregatedPaymentMethodDO extends BaseDO {
    paymentMethod: PaymentMethodDO;
    transactionFee: TransactionFeeDO;

    constructor() {
        super();
    }
    
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
		super.buildFromObject(object);

        this.transactionFee = new TransactionFeeDO();
        this.transactionFee.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "transactionFee"))

		this.paymentMethod = new PaymentMethodDO();
		this.paymentMethod.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paymentMethod"));
	}
}