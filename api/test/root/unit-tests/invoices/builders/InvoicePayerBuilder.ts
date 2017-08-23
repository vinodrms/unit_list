import {InvoicePayerDO} from '../../../../../../api/core/data-layer/invoices-deprecated/data-objects/payers/InvoicePayerDO';
import { InvoicePaymentMethodDO } from '../../../../../../api/core/data-layer/invoices-deprecated/data-objects/payers/InvoicePaymentMethodDO';
import { TransactionFeeDO } from "../../../../../core/data-layer/common/data-objects/payment-method/TransactionFeeDO";

export class InvoicePayerBuilder {
    private _customerId: string;
    private _paymentMethod: InvoicePaymentMethodDO;
    private _priceToPay: number;
    private _transactionFeeSnapshot: TransactionFeeDO;

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
    public withTransactionFeeSnapshot(transactionFeeSnapshot: TransactionFeeDO) {
        this._transactionFeeSnapshot = transactionFeeSnapshot;
        return this;
    }

    public build(): InvoicePayerDO {
        var payer = new InvoicePayerDO();
        payer.customerId = this._customerId;
        payer.paymentMethod = this._paymentMethod;
        payer.priceToPay = this._priceToPay;
        payer.transactionFeeSnapshot = this._transactionFeeSnapshot;
        payer.priceToPayPlusTransactionFee = this._transactionFeeSnapshot.getAmountWihtTransactionFeeIncluded(this._priceToPay);
        return payer;
    }
}
