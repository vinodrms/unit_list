import _ = require('underscore');
import { PaymentMethodDO } from "../../../data-layer/common/data-objects/payment-method/PaymentMethodDO";
import { InvoicePaymentMethodDO, InvoicePaymentMethodType } from "../../../data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO";

export class InvoicePaymentMethodsUtils {
    private static PaidInvoiceByAgreementDisplayName = "Paid by Agreement";

    private _indexedPaymentMethodsById: { [id: string]: PaymentMethodDO };

    constructor(paymentMethodList: PaymentMethodDO[]) {
        this._indexedPaymentMethodsById = _.indexBy(paymentMethodList, (paymentMethod: PaymentMethodDO) => {
            return paymentMethod.id;
        })
    }

    public getPaymentMethodName(invoicePaymentMethod: InvoicePaymentMethodDO) {
        if (invoicePaymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
            return InvoicePaymentMethodsUtils.PaidInvoiceByAgreementDisplayName;
        }

        let pm = this._indexedPaymentMethodsById[invoicePaymentMethod.value];
        return (pm) ? pm.name : "";
    }
}
