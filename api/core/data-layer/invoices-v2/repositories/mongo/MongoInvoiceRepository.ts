import { MongoRepository } from "../../../common/base/MongoRepository";
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from "../../../common/repo-data-objects/LazyLoadRepoDO";
import { IInvoiceRepository, InvoiceMetaRepoDO, InvoiceSearchCriteriaRepoDO, InvoiceSearchResultRepoDO, InvoiceItemMetaRepoDO } from "../IInvoiceRepository";
import { InvoiceDO } from "../../data-objects/InvoiceDO";
import { IHotelRepository } from "../../../hotel/repositories/IHotelRepository";
import { MongoInvoiceReadOperationsRepository } from "./operations/MongoInvoiceReadOperationsRepository";

declare var sails: any;

export class MongoInvoiceRepository extends MongoRepository implements IInvoiceRepository {
    private readRepository: MongoInvoiceReadOperationsRepository;

    constructor(hotelRepo: IHotelRepository) {
        super(sails.models.invoicesentity);

        this.readRepository = new MongoInvoiceReadOperationsRepository(sails.models.invoicesentity);
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
        throw new Error("Method not implemented.");
    }
    updateInvoice(invoiceMeta: InvoiceMetaRepoDO, invoiceItemMeta: InvoiceItemMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        throw new Error("Method not implemented.");
    }
}
