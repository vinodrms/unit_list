import { AppContext } from "../../../../../utils/AppContext";
import { SessionContext } from "../../../../../utils/SessionContext";
import { ThError } from "../../../../../utils/th-responses/ThError";
import { ThUtils } from "../../../../../utils/ThUtils";
import { ISaveInvoiceActionStrategy } from "../ISaveInvoiceActionStrategy";
import { InvoiceDO } from "../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoicePaymentDO } from "../../../../../data-layer/invoices/data-objects/payer/InvoicePaymentDO";
import { InvoiceItemDO } from "../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO";

export abstract class AInvoiceStrategy implements ISaveInvoiceActionStrategy {
    // we want all the timestamps for the new payments/items to be the same
    private timestamp: number;

    private thUtils: ThUtils;

    constructor(protected appContext: AppContext,
        protected sessionContext: SessionContext,
        protected invoice: InvoiceDO) {
        this.timestamp = (new Date()).getTime();
        this.thUtils = new ThUtils();
    }

    abstract saveInvoice(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void });

    protected get hotelId(): string {
        return this.sessionContext.sessionDO.hotel.id;
    }

    protected stampPayment(payment: InvoicePaymentDO) {
        payment.transactionId = this.thUtils.generateUniqueID();
        payment.timestamp = this.timestamp;
    }

    protected stampItem(item: InvoiceItemDO) {
        item.transactionId = this.thUtils.generateUniqueID();
        item.timestamp = this.timestamp;
    }
}
