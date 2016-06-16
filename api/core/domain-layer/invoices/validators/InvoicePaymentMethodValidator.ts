import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {InvoicePaymentMethodDO, InvoicePaymentMethodType} from '../../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {ThUtils} from '../../../utils/ThUtils';

import _ = require('underscore');

export class InvoicePaymentMethodValidator {
    private _thUtils: ThUtils;
    private _invoicePaymentMethod: InvoicePaymentMethodDO;

    constructor(private _hotelDO: HotelDO, private _customer: CustomerDO) {
        this._thUtils = new ThUtils();
    }

    public validate(invoicePaymentMethod: InvoicePaymentMethodDO): Promise<InvoicePaymentMethodDO> {
        this._invoicePaymentMethod = invoicePaymentMethod;
        return new Promise<InvoicePaymentMethodDO>((resolve: { (result: InvoicePaymentMethodDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.validateCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.InvoicePaymentMethodValidatorError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error validating payment methods", this._invoicePaymentMethod, thError);
                reject(thError);
            }
        });
    }
    private validateCore(resolve: { (result: InvoicePaymentMethodDO): void }, reject: { (err: ThError): void }) {
        if (this._invoicePaymentMethod.type === InvoicePaymentMethodType.DefaultPaymentMethod) {
            this.validateDefaultPaymentMethod(resolve, reject);
            return;
        }
        if (this._invoicePaymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
            this.validatePayInvoiceByAgreement(resolve, reject);
            return;
        }
        var thError = new ThError(ThStatusCode.InvoicePaymentMethodValidatorInvalidPaymentMethod, null);
        ThLogger.getInstance().logBusiness(ThLogLevel.Error, "invalid payment method", this._invoicePaymentMethod, thError);
        reject(thError);
    }
    private validateDefaultPaymentMethod(resolve: { (result: InvoicePaymentMethodDO): void }, reject: { (err: ThError): void }) {
        var foundPaymentMethodId: string = _.find(this._hotelDO.paymentMethodIdList, (paymentMethodId: string) => {
            return paymentMethodId === this._invoicePaymentMethod.value;
        });
        if (this._thUtils.isUndefinedOrNull(foundPaymentMethodId) || !_.isString(foundPaymentMethodId)) {
            var thError = new ThError(ThStatusCode.InvoicePaymentMethodValidatorUnsupportedPaymentMethod, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "unsupported payment method", this._invoicePaymentMethod, thError);
            reject(thError);
            return;
        }
        resolve(this._invoicePaymentMethod);
    }
    private validatePayInvoiceByAgreement(resolve: { (result: InvoicePaymentMethodDO): void }, reject: { (err: ThError): void }) {
        if (!this._customer.customerDetails.canPayInvoiceByAgreement()) {
            var thError = new ThError(ThStatusCode.InvoicePaymentMethodValidatorCannotPayByAgreement, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "cannot pay invoice by agreement", this._invoicePaymentMethod, thError);
            reject(thError);
            return;
        }
        resolve(this._invoicePaymentMethod);
    }
}