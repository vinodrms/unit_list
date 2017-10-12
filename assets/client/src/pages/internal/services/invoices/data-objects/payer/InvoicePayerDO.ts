import { BaseDO } from '../../../../../../common/base/BaseDO';
import { InvoicePaymentDO } from './InvoicePaymentDO';

export class InvoicePayerDO extends BaseDO {
    customerId: string;
    paymentList: InvoicePaymentDO[];

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["customerId"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.paymentList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "paymentList"), (paymentObject: Object) => {
            var payment = new InvoicePaymentDO();
            payment.buildFromObject(paymentObject);
            this.paymentList.push(payment);
        });
    }
}
