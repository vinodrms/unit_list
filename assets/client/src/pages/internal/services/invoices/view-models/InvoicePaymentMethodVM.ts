import { InvoicePaymentMethodDO } from '../data-objects/payer/InvoicePaymentMethodDO';
import { TransactionFeeDO } from "../../common/data-objects/payment-method/TransactionFeeDO";

export class InvoicePaymentMethodVM {
    private _paymentMethod: InvoicePaymentMethodDO;
    private _displayName: string;
    private _iconUrl: string;
    private _transactionFee: TransactionFeeDO;

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
    public get iconUrl(): string {
        return this._iconUrl;
    }
    public set iconUrl(iconUrl: string) {
        this._iconUrl = iconUrl;
    }
    public get transactionFee(): TransactionFeeDO {
        return this._transactionFee;
    }
    public set transactionFee(transactionFee: TransactionFeeDO) {
        this._transactionFee = transactionFee;
    }

    public buildPrototype(): InvoicePaymentMethodVM {
        var pmVM = new InvoicePaymentMethodVM();
        pmVM.paymentMethod = this.paymentMethod.buildPrototype();
        pmVM.displayName = this.displayName;
        pmVM.iconUrl = this.iconUrl;
        pmVM.transactionFee = this._transactionFee;
        return pmVM;
    }
}
