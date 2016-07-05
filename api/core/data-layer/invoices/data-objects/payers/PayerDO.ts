import {BaseDO} from '../../../common/base/BaseDO';
import {InvoicePaymentMethodDO} from './InvoicePaymentMethodDO';
import {CommissionDO} from '../../../common/data-objects/commission/CommissionDO';

//TODO customerIdValidator
export class PayerDO extends BaseDO {
    constructor() {
        super();
    }

    customerId: string;
    paymentMethod: InvoicePaymentMethodDO;
    commissionSnapshot: CommissionDO;
    priceToPay: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["customerId", "priceToPay"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        if (this.getObjectPropertyEnsureUndefined(object, "paymentMethod") != null) {
            this.paymentMethod = new InvoicePaymentMethodDO();
            this.paymentMethod.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paymentMethod"));
        }

        if (this.getObjectPropertyEnsureUndefined(object, "commissionSnapshot") != null) {
            this.commissionSnapshot = new CommissionDO();
            this.commissionSnapshot.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "commissionSnapshot"));
        }
    }
}