import _ = require('underscore');
import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { CustomerDO } from '../../../data-layer/customers/data-objects/CustomerDO';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { ThUtils } from '../../../utils/ThUtils';
import { PaymentMethodInstanceDO } from "../../../data-layer/common/data-objects/payment-method/PaymentMethodInstanceDO";
import { InvoicePaymentMethodDO, InvoicePaymentMethodType } from "../../../data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO";
import { PaymentMethodDO } from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';

export class InvoicePaymentMethodValidator {
    private thUtils: ThUtils;
    private invoicePaymentMethod: InvoicePaymentMethodDO;
    private enforceEnabledPaymentMethods: boolean;

    constructor(private hotel: HotelDO, private customer: CustomerDO, private allPaymentMethods: PaymentMethodDO[]) {
        this.thUtils = new ThUtils();
    }

    public validate(invoicePaymentMethod: InvoicePaymentMethodDO, enforceEnabledPaymentMethods: boolean): Promise<InvoicePaymentMethodDO> {
        this.invoicePaymentMethod = invoicePaymentMethod;
        this.enforceEnabledPaymentMethods = enforceEnabledPaymentMethods;
        return new Promise<InvoicePaymentMethodDO>((resolve: { (result: InvoicePaymentMethodDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.validateCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.InvoicePaymentMethodValidatorError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error validating payment methods", this.invoicePaymentMethod, thError);
                reject(thError);
            }
        });
    }
    private validateCore(resolve: { (result: InvoicePaymentMethodDO): void }, reject: { (err: ThError): void }) {
        if (this.invoicePaymentMethod.type === InvoicePaymentMethodType.DefaultPaymentMethod) {
            this.validateDefaultPaymentMethod(resolve, reject);
            return;
        }
        if (this.invoicePaymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
            this.validatePayInvoiceByAgreement(resolve, reject);
            return;
        }
        var thError = new ThError(ThStatusCode.InvoicePaymentMethodValidatorInvalidPaymentMethod, null);
        ThLogger.getInstance().logBusiness(ThLogLevel.Error, "invalid payment method", this.invoicePaymentMethod, thError);
        reject(thError);
    }
    private validateDefaultPaymentMethod(resolve: { (result: InvoicePaymentMethodDO): void }, reject: { (err: ThError): void }) {
        let pm: PaymentMethodDO = _.find(this.allPaymentMethods, (p: PaymentMethodDO) => { return p.id === this.invoicePaymentMethod.value; });
        if (this.thUtils.isUndefinedOrNull(pm) || !_.isString(pm.id)) {
            var thError = new ThError(ThStatusCode.InvoicePaymentMethodValidatorInvalidPaymentMethod, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "invalid payment method", this.invoicePaymentMethod, thError);
            reject(thError);
            return;
        }
        if (!this.enforceEnabledPaymentMethods) {
            resolve(this.invoicePaymentMethod);
        }
        var foundPaymentMethod: PaymentMethodInstanceDO = _.find(this.hotel.paymentMethodList, (paymentMethodInstance: PaymentMethodInstanceDO) => {
            return paymentMethodInstance.paymentMethodId === this.invoicePaymentMethod.value;
        });
        if (this.thUtils.isUndefinedOrNull(foundPaymentMethod) || !_.isString(foundPaymentMethod.paymentMethodId)) {
            var thError = new ThError(ThStatusCode.InvoicePaymentMethodValidatorUnsupportedPaymentMethod, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "unsupported payment method", this.invoicePaymentMethod, thError);
            reject(thError);
            return;
        }
        resolve(this.invoicePaymentMethod);
    }
    private validatePayInvoiceByAgreement(resolve: { (result: InvoicePaymentMethodDO): void }, reject: { (err: ThError): void }) {
        if (!this.enforceEnabledPaymentMethods) {
            resolve(this.invoicePaymentMethod);
        }
        if (!this.customer.customerDetails.canPayInvoiceByAgreement()) {
            var thError = new ThError(ThStatusCode.InvoicePaymentMethodValidatorCannotPayByAgreement, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "cannot pay invoice by agreement", this.invoicePaymentMethod, thError);
            reject(thError);
            return;
        }
        resolve(this.invoicePaymentMethod);
    }
}
