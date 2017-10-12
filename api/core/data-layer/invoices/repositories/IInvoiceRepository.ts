import { InvoiceDO, InvoicePaymentStatus, InvoiceAccountingType } from '../data-objects/InvoiceDO';
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from '../../common/repo-data-objects/LazyLoadRepoDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';

export interface InvoiceMetaRepoDO {
    hotelId: string;
}

export interface InvoiceItemMetaRepoDO {
    id: string;
    versionId: number;
}

export interface InvoiceSearchCriteriaRepoDO {
    bookingId?: string;
    bookingIdList?: string[];
    customerIdList?: string[];
    invoicePaymentStatus?: InvoicePaymentStatus;
    invoiceAccountingType?: InvoiceAccountingType;
    paidInterval?: ThDateIntervalDO;
    payerCustomerIdList?: string[];
    groupId?: string;
    term?: string;
    invoiceIdList?: string[];
    reference?: string;
    excludedInvoiceId?: string;
}

export interface InvoiceSearchResultRepoDO {
    lazyLoad?: LazyLoadRepoDO;
    invoiceList: InvoiceDO[];
}

export interface IInvoiceRepository {
    getInvoiceById(invoiceMeta: InvoiceMetaRepoDO, invoiceId: string): Promise<InvoiceDO>;
    getInvoiceList(invoiceMeta: InvoiceMetaRepoDO, searchCriteria?: InvoiceSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceSearchResultRepoDO>;
    getInvoiceListCount(invoiceMeta: InvoiceMetaRepoDO, searchCriteria?: InvoiceSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO>;

    addInvoice(invoiceMeta: InvoiceMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO>;
    updateInvoice(invoiceMeta: InvoiceMetaRepoDO, invoiceItemMeta: InvoiceItemMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO>;
}
