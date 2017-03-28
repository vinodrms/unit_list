import { BaseDO } from "../../../../../../common/base/BaseDO";
import { PaymentMethodDO } from "./PaymentMethodDO";

export class AggregatedPaymentMethodDO extends BaseDO {
    paymentMethod: PaymentMethodDO;
    transactionFee: number;

    constructor() {
        super();
    }
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["transactionFee"];
    }

    public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.paymentMethod = new PaymentMethodDO();
		this.paymentMethod.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paymentMethod"));
	}
}