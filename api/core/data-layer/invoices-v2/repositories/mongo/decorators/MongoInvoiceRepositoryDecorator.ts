import { MongoInvoiceRepository } from '../MongoInvoiceRepository';
import { IInvoiceRepository, InvoiceMetaRepoDO, InvoiceItemMetaRepoDO, InvoiceSearchCriteriaRepoDO, InvoiceSearchResultRepoDO } from '../../IInvoiceRepository';
import { InvoiceDO } from '../../../data-objects/InvoiceDO';
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import { MongoRepository, MongoErrorCodes, MongoSearchCriteria } from '../../../../common/base/MongoRepository';

declare var sails: any;

export class MongoInvoiceRepositoryDecorator extends MongoRepository implements IInvoiceRepository {
    constructor(protected invoiceRepo: MongoInvoiceRepository) {
        super(sails.models.invoicesentity);
    }

    getInvoiceById(invoiceMeta: InvoiceMetaRepoDO, invoiceId: string): Promise<InvoiceDO> {
        return this.invoiceRepo.getInvoiceById(invoiceMeta, invoiceId);
    }
    getInvoiceList(invoiceMeta: InvoiceMetaRepoDO, searchCriteria?: InvoiceSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceSearchResultRepoDO> {
        return this.invoiceRepo.getInvoiceList(invoiceMeta, searchCriteria, lazyLoad);
    }
    getInvoiceListCount(invoiceMeta: InvoiceMetaRepoDO, searchCriteria?: InvoiceSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return this.invoiceRepo.getInvoiceListCount(invoiceMeta, searchCriteria);
    }
    addInvoice(invoiceMeta: InvoiceMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        return this.invoiceRepo.addInvoice(invoiceMeta, invoice);
    }
    updateInvoice(invoiceMeta: InvoiceMetaRepoDO, invoiceItemMeta: InvoiceItemMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        return this.invoiceRepo.updateInvoice(invoiceMeta, invoiceItemMeta, invoice);
    }
}
