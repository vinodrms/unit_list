import { BaseDO } from '../../../../../../common/base/BaseDO';
import { InvoicePaymentMethodDO } from './InvoicePaymentMethodDO';
import { CommissionDO } from '../../../common/data-objects/commission/CommissionDO';
import { CustomerDO } from '../../../customers/data-objects/CustomerDO';
import { CorporateDetailsDO } from '../../../customers/data-objects/customer-details/CorporateDetailsDO';

export class InvoicePayerDO extends BaseDO {
    customerId: string;
    paymentMethod: InvoicePaymentMethodDO;
    commissionSnapshot: CommissionDO;
    priceToPay: number;
    additionalInvoiceDetails: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["customerId", "priceToPay", "additionalInvoiceDetails"];
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

    public static buildFromCustomerDOAndPaymentMethod(customer: CustomerDO, paymentMethod: InvoicePaymentMethodDO): InvoicePayerDO {
        var invoicePayer = new InvoicePayerDO();

        invoicePayer.customerId = customer.id;
        invoicePayer.paymentMethod = paymentMethod;
        invoicePayer.priceToPay = 0;
        if (customer.isCompanyOrTravelAgency()) {
            var corporateDetails = new CorporateDetailsDO();
            corporateDetails.buildFromObject(customer.customerDetails);
            invoicePayer.commissionSnapshot = corporateDetails.commission;
        }

        return invoicePayer;
    }
}