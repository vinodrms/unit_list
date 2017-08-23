import { BaseDO } from '../../../common/base/BaseDO';
import { InvoicePaymentMethodDO } from "./InvoicePaymentMethodDO";
import { TransactionFeeDO } from "../../../common/data-objects/payment-method/TransactionFeeDO";

export class InvoicePaymentDO extends BaseDO {
    paymentMethod: InvoicePaymentMethodDO;
    shouldApplyTransactionFee: boolean;
    transactionFeeSnapshot: TransactionFeeDO;
    priceToPay: number;
    priceToPayPlusTransactionFee: number;
    timestamp: number;
    notes: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["shouldApplyTransactionFee", "priceToPay", "priceToPayPlusTransactionFee", "timestamp", "notes"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.paymentMethod = new InvoicePaymentMethodDO();
        this.paymentMethod.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paymentMethod"));

        this.transactionFeeSnapshot = new TransactionFeeDO();
        this.transactionFeeSnapshot.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "transactionFeeSnapshot"));
    }
}
