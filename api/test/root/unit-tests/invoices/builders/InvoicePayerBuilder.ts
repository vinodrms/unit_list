import {InvoicePayerDO} from '../../../../../../api/core/data-layer/invoices/data-objects/payers/InvoicePayerDO';
import {InvoicePaymentMethodDO} from '../../../../../../api/core/data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';

export class InvoicePayerBuilder {
    private _customerId: string;
    private _paymentMethod: InvoicePaymentMethodDO;
    private _priceToPay: number;

    public withCustomerId(customerId: string): InvoicePayerBuilder {
        this._customerId = customerId;
        return this;
    }
    public withPaymentMethod(paymentMethod: InvoicePaymentMethodDO): InvoicePayerBuilder {
        this._paymentMethod = paymentMethod;
        return this;
    }
    public withPriceToPay(priceToPay: number): InvoicePayerBuilder {
        this._priceToPay = priceToPay;
        return this;
    }

    public build(): InvoicePayerDO {
        var payer = new InvoicePayerDO();
        payer.customerId = this._customerId;
        payer.paymentMethod = this._paymentMethod;
        payer.priceToPay = this._priceToPay;
        return payer;
    }
}