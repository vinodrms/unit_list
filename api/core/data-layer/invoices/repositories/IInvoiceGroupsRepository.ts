import {InvoiceGroupDO} from '../data-objects/InvoiceGroupDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';

export interface InvoiceGroupMetaRepoDO {
    hotelId: string;
}

export interface InvoiceGroupItemMetaRepoDO {
    id: string;
	versionId: number;
}

export interface InvoiceGroupSearchCriteriaRepoDO {
}

export interface InvoiceGroupSearchResultRepoDO {
	lazyLoad?: LazyLoadRepoDO;
	invoiceGroupList: InvoiceGroupDO[];
}


export interface IInvoiceGroupsRepository {
    getInvoiceGroupById(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupId: string): Promise<InvoiceGroupDO>;
    getInvoiceGroupList(invoidGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceGroupSearchResultRepoDO>;

    addInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO>;
	updateInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO>;
	deleteInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO): Promise<InvoiceGroupDO>;    
}