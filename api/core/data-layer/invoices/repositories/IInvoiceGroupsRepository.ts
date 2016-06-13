import {InvoiceGroupDO} from '../data-objects/InvoiceGroupDO';

export interface InvoiceGroupItemMetaRepoDO {
    id: string;
	versionId: number;
}

export interface IInvoiceGroupsRepository {
    addInvoiceGroup(invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO>;
	updateInvoiceGroup(invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO>;
	deleteInvoiceGroup(invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO): Promise<InvoiceGroupDO>;    
}