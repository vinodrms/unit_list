import { ThError } from '../../../../utils/th-responses/ThError';
import { InvoiceDO } from "../../../../data-layer/invoices/data-objects/InvoiceDO";

export interface ISaveInvoiceActionStrategy {
    saveInvoice(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void });
}
