import {InvoiceGroupDO} from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {ThError} from '../../../../utils/th-responses/ThError';

export interface IGenerateBookingInvoiceActionStrategy {
    generateBookingInvoice(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void });
}