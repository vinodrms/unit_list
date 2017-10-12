import { ThError } from '../../../../utils/th-responses/ThError';
import { InvoiceDO } from "../../../../data-layer/invoices/data-objects/InvoiceDO";

export interface IGenerateBookingInvoiceActionStrategy {
    generateBookingInvoice(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void });
}
