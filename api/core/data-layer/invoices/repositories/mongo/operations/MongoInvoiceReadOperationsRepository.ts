import { MongoRepository } from "../../../../common/base/MongoRepository";
import { InvoiceMetaRepoDO, InvoiceSearchCriteriaRepoDO, InvoiceSearchResultRepoDO } from "../../IInvoiceRepository";
import { InvoiceDO, InvoiceStatus } from "../../../data-objects/InvoiceDO";
import { ThError } from "../../../../../utils/th-responses/ThError";
import { ThStatusCode } from "../../../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../../../utils/logging/ThLogger";
import { LazyLoadMetaResponseRepoDO, LazyLoadRepoDO } from "../../../../common/repo-data-objects/LazyLoadRepoDO";
import { MongoQueryBuilder } from "../../../../common/base/MongoQueryBuilder";
import { ThDateUtils } from "../../../../../utils/th-dates/ThDateUtils";
import { ThDateIntervalDO } from "../../../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { IndexedBookingInterval } from "../../../../price-products/utils/IndexedBookingInterval";
import { IHotelRepository } from "../../../../hotel/repositories/IHotelRepository";

export class MongoInvoiceReadOperationsRepository extends MongoRepository {

    constructor(invoicesEntity: any, private hotelRepo: IHotelRepository) {
        super(invoicesEntity);
    }

    getInvoiceById(invoiceMeta: InvoiceMetaRepoDO, invoiceId: string): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.getInvoiceByIdCore(invoiceMeta, invoiceId, resolve, reject);
        });
    }

    private getInvoiceByIdCore(invoiceMeta: InvoiceMetaRepoDO, invoiceId: string, resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        this.findOneDocument({ "hotelId": invoiceMeta.hotelId, "id": invoiceId },
            () => {
                var thError = new ThError(ThStatusCode.InvoiceRepositoryInvoiceNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invoice not found", { invoidMeta: invoiceMeta, invoiceId: invoiceId }, thError);
                reject(thError);
            },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.InvoiceRepositoryErrorGettingInvoice, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting invoice by id", { invoidMeta: invoiceMeta, invoiceId: invoiceId }, thError);
                reject(thError);
            },
            (foundInvoice: Object) => {
                var invoice: InvoiceDO = new InvoiceDO();
                invoice.buildFromObject(foundInvoice);
                resolve(invoice);
            }
        );
    }

    getInvoiceListCount(invoiceMeta: InvoiceMetaRepoDO, searchCriteria?: InvoiceSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return new Promise<LazyLoadMetaResponseRepoDO>((resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }) => {
            this.getInvoiceListCountCore(resolve, reject, invoiceMeta, searchCriteria);
        });
    }
    private getInvoiceListCountCore(resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }, invoiceMeta: InvoiceMetaRepoDO, searchCriteria?: InvoiceSearchCriteriaRepoDO) {
        this.getTimezoneIfNecessary(invoiceMeta, searchCriteria).then(timezone => {
            var query = this.buildSearchCriteria(invoiceMeta, searchCriteria, timezone);
            return this.getDocumentCount(query,
                (err: Error) => {
                    var thError = new ThError(ThStatusCode.InvoiceRepositoryErrorReadingDocumentCount, err);
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error reading document count", { meta: invoiceMeta, searchCriteria: searchCriteria }, thError);
                    reject(thError);
                },
                (meta: LazyLoadMetaResponseRepoDO) => {
                    resolve(meta);
                });
        }).catch(e => {
            reject(e);
        });
    }

    getInvoiceList(invoiceMeta: InvoiceMetaRepoDO, searchCriteria?: InvoiceSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceSearchResultRepoDO> {
        return new Promise<InvoiceSearchResultRepoDO>((resolve: { (result: InvoiceSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.getInvoiceListCore(resolve, reject, invoiceMeta, searchCriteria, lazyLoad);
        });
    }
    private getInvoiceListCore(resolve: { (result: InvoiceSearchResultRepoDO): void }, reject: { (err: ThError): void }, invoiceMeta: InvoiceMetaRepoDO, searchCriteria?: InvoiceSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO) {
        this.getTimezoneIfNecessary(invoiceMeta, searchCriteria).then(timezone => {
            this.findMultipleDocuments({ criteria: this.buildSearchCriteria(invoiceMeta, searchCriteria, timezone), lazyLoad: lazyLoad },
                (err: Error) => {
                    var thError = new ThError(ThStatusCode.InvoiceRepositoryErrorGettingInvoiceList, err);
                    ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting invoice list.", searchCriteria, thError);
                    reject(thError);
                },
                (dbInvoiceList: Array<Object>) => {
                    var resultDO = this.getQueryResultDO(dbInvoiceList);
                    resolve({
                        invoiceList: resultDO,
                        lazyLoad: lazyLoad
                    });
                }
            );
        }).catch(e => {
            reject(e);
        });
    }
    private getQueryResultDO(dbInvoiceList: Array<Object>): InvoiceDO[] {
        var invoiceList: InvoiceDO[] = [];
        dbInvoiceList.forEach((dbInvoice: Object) => {
            var invoice = new InvoiceDO();
            invoice.buildFromObject(dbInvoice);
            invoiceList.push(invoice);
        });
        return invoiceList;
    }
    private buildSearchCriteria(meta: InvoiceMetaRepoDO, searchCriteria: InvoiceSearchCriteriaRepoDO, timezone: string): Object {
        var mongoQueryBuilder = new MongoQueryBuilder();
        mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
        mongoQueryBuilder.addExactMatch("status", InvoiceStatus.Active);

        if (!this._thUtils.isUndefinedOrNull(searchCriteria)) {
            mongoQueryBuilder.addExactMatch("indexedBookingIdList", searchCriteria.bookingId);
            mongoQueryBuilder.addMultipleSelectOptionList("indexedBookingIdList", searchCriteria.bookingIdList);
            mongoQueryBuilder.addMultipleSelectOptionList("indexedCustomerIdList", searchCriteria.customerIdList);
            mongoQueryBuilder.addExactMatch("paymentStatus", searchCriteria.invoicePaymentStatus);
            mongoQueryBuilder.addExactMatch("accountingType", searchCriteria.invoiceAccountingType);
            mongoQueryBuilder.addMultipleSelectOptionList("payerList.customerId", searchCriteria.payerCustomerIdList);
            if (!this._thUtils.isUndefinedOrNull(searchCriteria.paidInterval)) {
                var searchInterval = new ThDateIntervalDO();
                searchInterval.buildFromObject(searchCriteria.paidInterval);
                if (searchInterval.start.isValid() && searchInterval.end.isValid()) {
                    let dateUtils = new ThDateUtils();
                    let endDate = dateUtils.addDaysToThDateDO(searchInterval.end, 1);
                    mongoQueryBuilder.addCustomQuery("$and",
                        [
                            { "paidTimestamp": { $gte: searchInterval.start.getTimestamp(timezone) } },
                            { "paidTimestamp": { $lt: endDate.getTimestamp(timezone) } }
                        ]
                    );
                }
            }
            mongoQueryBuilder.addExactMatch("groupId", searchCriteria.groupId);
            // for now the search term is only checked against the invoice reference
            mongoQueryBuilder.addRegex("reference", searchCriteria.term);

            mongoQueryBuilder.addMultipleSelectOptionList("id", searchCriteria.invoiceIdList);
            mongoQueryBuilder.addExactMatch("reference", searchCriteria.reference);
            mongoQueryBuilder.addNotEqualMatch("id", searchCriteria.excludedInvoiceId);
        }

        return mongoQueryBuilder.processedQuery;
    }

    private getTimezoneIfNecessary(invoiceMeta: InvoiceMetaRepoDO, searchCriteria: InvoiceSearchCriteriaRepoDO): Promise<string> {
        return new Promise<string>((resolve: { (result: string): void }, reject: { (err: ThError): void }) => {
            if (this._thUtils.isUndefinedOrNull(searchCriteria, "paidInterval.start") ||
                this._thUtils.isUndefinedOrNull(searchCriteria, "paidInterval.end")) {
                resolve(null);
                return;
            }
            this.hotelRepo.getHotelById(invoiceMeta.hotelId)
                .then(hotel => {
                    resolve(hotel.timezone);
                }).catch(e => {
                    reject(e);
                })
        });
    }

}
