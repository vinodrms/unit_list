import { ThUtils } from '../../../../../../core/utils/ThUtils';
import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { IBookingRepository, BookingSearchResultRepoDO, BookingMetaRepoDO, BookingSearchCriteriaRepoDO } from '../../../../bookings/repositories/IBookingRepository';
import { ICustomerRepository, CustomerSearchResultRepoDO, CustomerSearchCriteriaRepoDO, CustomerMetaRepoDO } from '../../../../customers/repositories/ICustomerRepository';
import { IInvoiceRepository, InvoiceMetaRepoDO, InvoiceItemMetaRepoDO, InvoiceSearchCriteriaRepoDO, InvoiceSearchResultRepoDO } from '../../IInvoiceRepository';
import { InvoiceDO } from '../../../data-objects/InvoiceDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../data-objects/items/InvoiceItemDO';
import { BookingDO } from '../../../../bookings/data-objects/BookingDO';
import { MongoInvoiceRepository } from "../MongoInvoiceRepository";
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import { MongoRepository, MongoErrorCodes, MongoSearchCriteria } from '../../../../common/base/MongoRepository';
import { MongoInvoiceRepositoryDecorator } from "./MongoInvoiceRepositoryDecorator";
import { InvoicePayerDO } from "../../../data-objects/payer/InvoicePayerDO";
import { InvoicePaymentDO } from "../../../data-objects/payer/InvoicePaymentDO";
import { InvoicePaymentMethodType } from "../../../data-objects/payer/InvoicePaymentMethodDO";
import { CustomerDO } from "../../../../customers/data-objects/CustomerDO";

import _ = require('underscore');

export class MongoInvoiceRepositoryWithBookingPriceLink extends MongoInvoiceRepositoryDecorator {

    constructor(invoiceRepo: MongoInvoiceRepository, private bookingsRepo: IBookingRepository,
        private customersRepo: ICustomerRepository) {
        super(invoiceRepo);
    }

    getInvoiceById(invoiceMeta: InvoiceMetaRepoDO, invoiceId: string): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.invoiceRepo.getInvoiceById(invoiceMeta, invoiceId).then((invoice: InvoiceDO) => {
                this.linkBookingsToInvoice(invoiceMeta, invoice).then((updatedInvoice: InvoiceDO) => {
                    resolve(updatedInvoice);
                }).catch((err: ThError) => {
                    reject(err);
                });
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }
    getInvoiceList(invoiceMeta: InvoiceMetaRepoDO, searchCriteria?: InvoiceSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceSearchResultRepoDO> {
        return new Promise<InvoiceSearchResultRepoDO>((resolve: { (result: InvoiceSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.invoiceRepo.getInvoiceList(invoiceMeta, searchCriteria, lazyLoad).then((result: InvoiceSearchResultRepoDO) => {
                this.linkBookingsToInvoiceSearchResult(invoiceMeta, result).then((updatedResult: InvoiceSearchResultRepoDO) => {
                    resolve(updatedResult);
                }).catch((err: ThError) => {
                    reject(err);
                });
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }
    addInvoice(invoiceMeta: InvoiceMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        invoice.removeItemsPopulatedFromBooking();
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.invoiceRepo.addInvoice(invoiceMeta, invoice).then((invoice: InvoiceDO) => {
                this.linkBookingsToInvoice(invoiceMeta, invoice).then((updatedInvoice: InvoiceDO) => {
                    resolve(updatedInvoice);
                }).catch((err: ThError) => {
                    reject(err);
                });
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }
    updateInvoice(invoiceMeta: InvoiceMetaRepoDO, invoiceItemMeta: InvoiceItemMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        invoice.removeItemsPopulatedFromBooking();
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.invoiceRepo.updateInvoice(invoiceMeta, invoiceItemMeta, invoice).then((invoice: InvoiceDO) => {
                this.linkBookingsToInvoice(invoiceMeta, invoice).then((updatedInvoice: InvoiceDO) => {
                    resolve(updatedInvoice);
                }).catch((err: ThError) => {
                    reject(err);
                });
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }

    private linkBookingsToInvoice(invoiceMeta: InvoiceMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.linkBookingsToInvoiceList(invoiceMeta, [invoice]).then((invoiceList: InvoiceDO[]) => {
                resolve(invoiceList[0]);
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }

    private linkBookingsToInvoiceSearchResult(invoiceMeta: InvoiceMetaRepoDO, invoiceSearchResult: InvoiceSearchResultRepoDO): Promise<InvoiceSearchResultRepoDO> {
        return new Promise<InvoiceSearchResultRepoDO>((resolve: { (result: InvoiceSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.linkBookingsToInvoiceList(invoiceMeta, invoiceSearchResult.invoiceList).then((invoiceList: InvoiceDO[]) => {
                invoiceSearchResult.invoiceList = invoiceList;
                resolve(invoiceSearchResult);
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }

    private linkBookingsToInvoiceList(invoiceMeta: InvoiceMetaRepoDO, invoiceList: InvoiceDO[]): Promise<InvoiceDO[]> {
        return new Promise<InvoiceDO[]>((resolve: { (result: InvoiceDO[]): void }, reject: { (err: ThError): void }) => {
            this.linkBookingsToInvoiceListCore(resolve, reject, invoiceMeta, invoiceList);
        });
    }
    private linkBookingsToInvoiceListCore(resolve: { (result: InvoiceDO[]): void }, reject: { (err: ThError): void }, invoiceMeta: InvoiceMetaRepoDO, invoiceList: InvoiceDO[]) {
        let meta = this.buildBookingMetaFromInvoiceMeta(invoiceMeta);
        let searchCriteria = this.buildBookingListSearchCriteria(invoiceList);
        this.bookingsRepo.getBookingList(meta, searchCriteria)
            .then((result: BookingSearchResultRepoDO) => {
                let indexedBookingsById: { [id: string]: BookingDO; } = _.indexBy(result.bookingList, (booking: BookingDO) => { return booking.id });
                _.forEach(invoiceList, (invoice: InvoiceDO) => {
                    invoice.linkBookings(indexedBookingsById);
                });
                resolve(invoiceList);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.InvoiceRepositoryBookingPriceLinkError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error linking the booking prices with the invoices", context, thError);
                reject(thError);
            });
    }

    private buildBookingMetaFromInvoiceMeta(invoidGroupMeta: InvoiceMetaRepoDO): BookingMetaRepoDO {
        return {
            hotelId: invoidGroupMeta.hotelId
        }
    }

    private buildBookingListSearchCriteria(invoiceList: InvoiceDO[]): BookingSearchCriteriaRepoDO {
        return {
            bookingIdList: _.chain(invoiceList)
                .map((invoice: InvoiceDO) => {
                    return invoice.indexedBookingIdList;
                })
                .flatten()
                .uniq()
                .value()
        };
    }
}
