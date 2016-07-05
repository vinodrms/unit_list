import {InvoicePaymentMethodDO} from '../data-objects/payers/InvoicePaymentMethodDO';

export class InvoicePaymentMethodVM {
    private _paymentMethod: InvoicePaymentMethodDO;
    private _displayName: string;

    public get paymentMethod(): InvoicePaymentMethodDO {
        return this._paymentMethod;
    }
    public set paymentMethod(paymentMethod: InvoicePaymentMethodDO) {
        this._paymentMethod = paymentMethod;
    }
    public get displayName(): string {
        return this._displayName;
    }
    public set displayName(displayName: string) {
        this._displayName = displayName;
    }
}