import {InvoiceDO, InvoicePaymentStatus} from '../data-objects/InvoiceDO';
import {InvoiceGroupDO} from '../data-objects/InvoiceGroupDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';

export interface InvoiceGroupMetaRepoDO {
    hotelId: string;
}

export interface InvoiceGroupItemMetaRepoDO {
    id: string;
    versionId: number;
}

export interface InvoiceGroupSearchCriteriaRepoDO {
    invoiceGroupIdList?: string[];
    groupBookingId?: string;
    bookingId?: string;
    customerIdList?: string[];
    invoicePaymentStatus?: InvoicePaymentStatus;
    paidInterval?: ThDateIntervalDO;
}

export interface InvoiceSearchCriteriaRepoDO {
    groupBookingId: string;
    bookingId: string;
}

export interface InvoiceGroupSearchResultRepoDO {
    lazyLoad?: LazyLoadRepoDO;
    invoiceGroupList: InvoiceGroupDO[];
}

export interface IInvoiceGroupsRepository {
    getInvoiceGroupById(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupId: string): Promise<InvoiceGroupDO>;
    getInvoiceGroupList(invoidGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceGroupSearchResultRepoDO>;
    getInvoiceGroupListCount(invoidGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO>;

    addInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO>;
    updateInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO>;
}