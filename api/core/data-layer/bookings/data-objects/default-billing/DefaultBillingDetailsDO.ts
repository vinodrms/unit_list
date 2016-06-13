import {BaseDO} from '../../../common/base/BaseDO';
import {InvoicePaymentMethodDO} from '../../../invoices/data-objects/payers/InvoicePaymentMethodDO';

export class DefaultBillingDetailsDO extends BaseDO {
    customerId: string;
    paymentGuarantee: boolean;
    paymentMethod: InvoicePaymentMethodDO;

    protected getPrimitivePropertyKeys(): string[] {
        return ["customerId", "paymentGuarantee"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.paymentMethod = new InvoicePaymentMethodDO();
        this.paymentMethod.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paymentMethod"));
    }
}