import {ThError} from '../../../../utils/th-responses/ThError';
import {InvoiceGroupDO} from '../../../../data-layer/invoices-deprecated/data-objects/InvoiceGroupDO';

export interface ISaveInvoiceGroupActionStrategy {
    saveInvoiceGroup(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void });
}
