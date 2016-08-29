import {InvoicePaymentMethodType, InvoicePaymentMethodDO} from '../../../../../../api/core/data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';

export class InvoicePaymentMethodBuilder {
    private _type: InvoicePaymentMethodType;
    private _value: string;

    public withType(type: InvoicePaymentMethodType): InvoicePaymentMethodBuilder {
        this._type = type;
        return this;
    }
    public withValue(value: string): InvoicePaymentMethodBuilder {
        this._value = value;
        return this;
    }

    public build(): InvoicePaymentMethodDO {
        var paymentMethod = new InvoicePaymentMethodDO();
        paymentMethod.type = this._type;
        paymentMethod.value = this._value;
        return paymentMethod;
    }
}