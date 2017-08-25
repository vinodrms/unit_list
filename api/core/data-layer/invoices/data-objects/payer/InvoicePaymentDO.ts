import { BaseDO } from '../../../common/base/BaseDO';
import { InvoicePaymentMethodDO } from "./InvoicePaymentMethodDO";
import { TransactionFeeDO } from "../../../common/data-objects/payment-method/TransactionFeeDO";

export class InvoicePaymentDO extends BaseDO {
    transactionId: string;
    paymentMethod: InvoicePaymentMethodDO;
    shouldApplyTransactionFee: boolean;
    transactionFeeSnapshot: TransactionFeeDO;
    amount: number;
    amountPlusTransactionFee: number;
    timestamp: number;
    notes: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["transactionId", "shouldApplyTransactionFee", "amount", "amountPlusTransactionFee", "timestamp", "notes"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.paymentMethod = new InvoicePaymentMethodDO();
        this.paymentMethod.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paymentMethod"));

        this.transactionFeeSnapshot = new TransactionFeeDO();
        this.transactionFeeSnapshot.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "transactionFeeSnapshot"));
    }
}
