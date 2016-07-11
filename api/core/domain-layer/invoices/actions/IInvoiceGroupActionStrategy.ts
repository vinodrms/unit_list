import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {ThError} from '../../../utils/th-responses/ThError';

export interface IInvoiceGroupActionStrategy {
    save(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void });    
}