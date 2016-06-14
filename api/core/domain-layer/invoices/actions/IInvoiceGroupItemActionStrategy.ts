import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {ThError} from '../../../utils/th-responses/ThError';

export interface IInvoiceGroupItemActionStrategy {
    save(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void });    
}