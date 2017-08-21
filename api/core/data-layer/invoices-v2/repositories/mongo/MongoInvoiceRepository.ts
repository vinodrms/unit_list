import { MongoRepository } from "../../../common/base/MongoRepository";
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from "../../../common/repo-data-objects/LazyLoadRepoDO";
import { IInvoiceRepository, InvoiceMetaRepoDO, InvoiceSearchCriteriaRepoDO, InvoiceSearchResultRepoDO, InvoiceItemMetaRepoDO } from "../IInvoiceRepository";
import { InvoiceDO } from "../../data-objects/InvoiceDO";
import { IHotelRepository } from "../../../hotel/repositories/IHotelRepository";
import { MongoInvoiceReadOperationsRepository } from "./operations/MongoInvoiceReadOperationsRepository";
import { MongoInvoiceEditOperationsRepository } from "./operations/MongoInvoiceEditOperationsRepository";

declare var sails: any;

export class MongoInvoiceRepository extends MongoRepository implements IInvoiceRepository {
    private readRepository: MongoInvoiceReadOperationsRepository;
    private editRepository: MongoInvoiceEditOperationsRepository;

    constructor(hotelRepo: IHotelRepository) {
        super(sails.models.invoicesentity);

        this.readRepository = new MongoInvoiceReadOperationsRepository(sails.models.invoicesentity);
        this.editRepository = new MongoInvoiceEditOperationsRepository(sails.models.invoicesentity, hotelRepo, this.readRepository);
    }

    getInvoiceById(invoiceMeta: InvoiceMetaRepoDO, invoiceId: string): Promise<InvoiceDO> {
        return this.readRepository.getInvoiceById(invoiceMeta, invoiceId);
    }
    getInvoiceList(invoiceMeta: InvoiceMetaRepoDO, searchCriteria?: InvoiceSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceSearchResultRepoDO> {
        return this.readRepository.getInvoiceList(invoiceMeta, searchCriteria, lazyLoad);
    }
    getInvoiceListCount(invoiceMeta: InvoiceMetaRepoDO, searchCriteria?: InvoiceSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return this.readRepository.getInvoiceListCount(invoiceMeta, searchCriteria);
    }
    addInvoice(invoiceMeta: InvoiceMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        return this.editRepository.addInvoice(invoiceMeta, invoice);
    }
    updateInvoice(invoiceMeta: InvoiceMetaRepoDO, invoiceItemMeta: InvoiceItemMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        return this.editRepository.updateInvoice(invoiceMeta, invoiceItemMeta, invoice);
    }
}
