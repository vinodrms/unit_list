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
                this.linkBookingPricesToInvoiceItem(invoiceMeta, invoice).then((updatedInvoice: InvoiceDO) => {
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
                this.linkBookingPricesToInvoiceSearchResultRepoDO(invoiceMeta, result).then((updatedResult: InvoiceSearchResultRepoDO) => {
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
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.invoiceRepo.addInvoice(invoiceMeta, invoice).then((invoice: InvoiceDO) => {
                this.linkBookingPricesToInvoiceItem(invoiceMeta, invoice).then((updatedInvoice: InvoiceDO) => {
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
                this.linkBookingPricesToInvoiceItem(invoiceMeta, invoice).then((updatedInvoice: InvoiceDO) => {
                    resolve(updatedInvoice);
                }).catch((err: ThError) => {
                    reject(err);
                });
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }

    private linkBookingPricesToInvoiceItem(invoiceMeta: InvoiceMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.linkBookingPricesToInvoiceList(invoiceMeta, [invoice]).then((invoiceList: InvoiceDO[]) => {
                resolve(invoiceList[0]);
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }
    private linkBookingPricesToInvoiceSearchResultRepoDO(invoiceMeta: InvoiceMetaRepoDO, invoiceSearchResult: InvoiceSearchResultRepoDO): Promise<InvoiceSearchResultRepoDO> {
        return new Promise<InvoiceSearchResultRepoDO>((resolve: { (result: InvoiceSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.linkBookingPricesToInvoiceList(invoiceMeta, invoiceSearchResult.invoiceList).then((invoiceList: InvoiceDO[]) => {
                invoiceSearchResult.invoiceList = invoiceList;
                resolve(invoiceSearchResult);
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }

    private linkBookingPricesToInvoiceList(invoiceMeta: InvoiceMetaRepoDO, invoiceList: InvoiceDO[]): Promise<InvoiceDO[]> {
        return new Promise<InvoiceDO[]>((resolve: { (result: InvoiceDO[]): void }, reject: { (err: ThError): void }) => {
            this.linkBookingPricesToInvoiceListCore(resolve, reject, invoiceMeta, invoiceList);
        });
    }
    private linkBookingPricesToInvoiceListCore(resolve: { (result: InvoiceDO[]): void }, reject: { (err: ThError): void }, invoiceMeta: InvoiceMetaRepoDO, invoiceList: InvoiceDO[]) {
        let meta = this.buildBookingMetaFromInvoiceMeta(invoiceMeta);
        let searchCriteria = this.buildBookingListSearchCriteria(invoiceList);
        this.bookingsRepo.getBookingList(meta, searchCriteria)
            .then((result: BookingSearchResultRepoDO) => {
                let indexedBookingsById: { [id: string]: BookingDO; } = _.indexBy(result.bookingList, (booking: BookingDO) => { return booking.id });
                _.forEach(invoiceList, (invoice: InvoiceDO) => {
                    invoice.linkBookingPrices(indexedBookingsById);
                });
                return this.addInvoiceFeeIfNecessary(invoiceMeta, invoiceList);
            }).then((invoiceList: InvoiceDO[]) => {
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

    private addInvoiceFeeIfNecessary(invoiceMeta: InvoiceMetaRepoDO, invoiceList: InvoiceDO[]): Promise<InvoiceDO[]> {
        return new Promise<InvoiceDO[]>((resolve: { (result: InvoiceDO[]): void }, reject: { (err: ThError): void }) => {
            this.addInvoiceFeeIfNecessaryCore(resolve, reject, invoiceMeta, invoiceList);
        });
    }
    private addInvoiceFeeIfNecessaryCore(resolve: { (result: InvoiceDO[]): void }, reject: { (err: ThError): void }, invoiceMeta: InvoiceMetaRepoDO, invoiceList: InvoiceDO[]) {

        // if no customer has paid by agreement an invoice from `invoiceList` we don't read them from the repository
        let customerIdListToPayInvoiceByAgreement = this.getCustomerIdListToPayInvoiceByAgreement(invoiceList);
        if (customerIdListToPayInvoiceByAgreement.length == 0) {
            resolve(invoiceList);
            return;
        }

        let meta = this.buildCustomerMetaFromInvoiceMeta(invoiceMeta);
        let searchCriteria: CustomerSearchCriteriaRepoDO = {
            customerIdList: customerIdListToPayInvoiceByAgreement
        };
        this.customersRepo.getCustomerList(meta, searchCriteria)
            .then((result: CustomerSearchResultRepoDO) => {
                let indexedCustomersById: { [id: string]: CustomerDO } = _.indexBy(result.customerList, (customer: CustomerDO) => { return customer.id });
                _.forEach(invoiceList, (invoice: InvoiceDO) => {
                    invoice.addInvoiceFeeIfNecessary(indexedCustomersById);
                });
                resolve(invoiceList);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.InvoiceRepositoryAddInvoiceFeeError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding invoice fee to the invoices if necessary", context, thError);
                reject(thError);
            });
    }
    private buildCustomerMetaFromInvoiceMeta(invoidGroupMeta: InvoiceMetaRepoDO): CustomerMetaRepoDO {
        return {
            hotelId: invoidGroupMeta.hotelId
        }
    }
    private getCustomerIdListToPayInvoiceByAgreement(invoiceList: InvoiceDO[]): string[] {
        return _.chain(invoiceList)
            .map((invoice: InvoiceDO) => {
                return invoice.payerList;
            }).flatten().filter((invoicePayer: InvoicePayerDO) => {
                let matchedPaymentList: InvoicePaymentDO[] = _.filter(invoicePayer.paymentList, (payment: InvoicePaymentDO) => {
                    return payment.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement;
                });
                return matchedPaymentList.length > 0;
            }).map((invoicePayer: InvoicePayerDO) => {
                return invoicePayer.customerId;
            })
            .uniq()
            .value();
    }
}
