import { ThUtils } from '../../../../../../core/utils/ThUtils';
import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { MongoInvoiceGroupsRepositoryDecorator } from './MongoInvoiceGroupsRepositoryDecorator';
import { MongoInvoiceGroupsRepository } from '../MongoInvoiceGroupsRepository';
import { IBookingRepository, BookingSearchResultRepoDO, BookingMetaRepoDO, BookingSearchCriteriaRepoDO } from '../../../../bookings/repositories/IBookingRepository';
import { ICustomerRepository, CustomerSearchResultRepoDO, CustomerSearchCriteriaRepoDO } from '../../../../customers/repositories/ICustomerRepository';
import { IInvoiceGroupsRepository, InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO, InvoiceGroupSearchCriteriaRepoDO, InvoiceGroupSearchResultRepoDO, InvoiceSearchCriteriaRepoDO } from '../../IInvoiceGroupsRepository'
import { InvoiceGroupDO } from '../../../data-objects/InvoiceGroupDO';
import { InvoiceDO } from '../../../data-objects/InvoiceDO';
import { InvoicePayerDO } from '../../../data-objects/payers/InvoicePayerDO';
import { InvoicePaymentMethodType } from '../../../data-objects/payers/InvoicePaymentMethodDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../data-objects/items/InvoiceItemDO';
import { BookingDO } from '../../../../bookings/data-objects/BookingDO';

import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import { MongoRepository, MongoErrorCodes, MongoSearchCriteria } from '../../../../common/base/MongoRepository';

import _ = require('underscore');

export class MongoInvoiceGroupsRepositoryWithBookingPriceLink extends MongoInvoiceGroupsRepositoryDecorator {

    constructor(invoiceGroupsRepo: MongoInvoiceGroupsRepository, private _bookingsRepo: IBookingRepository,
        private _customersRepo: ICustomerRepository) {
        super(invoiceGroupsRepo);
    }

    public getInvoiceGroupById(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupId: string): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this._invoiceGroupsRepo.getInvoiceGroupById(invoiceGroupMeta, invoiceGroupId).then((invoiceGroup: InvoiceGroupDO) => {
                this.linkBookingPricesToInvoiceGroupItem(invoiceGroupMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                    resolve(invoiceGroup);
                }).catch((err: ThError) => {
                    reject(err);
                });
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }
    public getInvoiceGroupList(invoiceGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceGroupSearchResultRepoDO> {
        return new Promise<InvoiceGroupSearchResultRepoDO>((resolve: { (result: InvoiceGroupSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this._invoiceGroupsRepo.getInvoiceGroupList(invoiceGroupMeta, searchCriteria, lazyLoad).then((result: InvoiceGroupSearchResultRepoDO) => {
                this.linkBookingPricesToInvoiceGroupSearchResultRepoDO(invoiceGroupMeta, result).then((result: InvoiceGroupSearchResultRepoDO) => {
                    resolve(result);
                }).catch((err: ThError) => {
                    reject(err);
                });
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }

    public addInvoiceGroup(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this._invoiceGroupsRepo.addInvoiceGroup(invoiceGroupMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                this.linkBookingPricesToInvoiceGroupItem(invoiceGroupMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                    resolve(invoiceGroup);
                }).catch((err: ThError) => {
                    reject(err);
                });
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }
    public updateInvoiceGroup(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        invoiceGroup.removeItemsPopulatedFromBooking();
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this._invoiceGroupsRepo.updateInvoiceGroup(invoiceGroupMeta, invoiceGroupItemMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                this.linkBookingPricesToInvoiceGroupItem(invoiceGroupMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                    resolve(invoiceGroup);
                }).catch((err: ThError) => {
                    reject(err);
                });
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }
    public deleteInvoiceGroup(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this._invoiceGroupsRepo.deleteInvoiceGroup(invoiceGroupMeta, invoiceGroupItemMeta).then((invoiceGroup: InvoiceGroupDO) => {
                this.linkBookingPricesToInvoiceGroupItem(invoiceGroupMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                    resolve(invoiceGroup);
                }).catch((err: ThError) => {
                    reject(err);
                });
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }

    private linkBookingPricesToInvoiceGroupItem(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.linkBookingPricesToInvoiceGroupList(invoiceGroupMeta, [invoiceGroup]).then((invoiceGroupList: InvoiceGroupDO[]) => {
                resolve(invoiceGroupList[0]);
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }

    private linkBookingPricesToInvoiceGroupSearchResultRepoDO(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupSearchResult: InvoiceGroupSearchResultRepoDO): Promise<InvoiceGroupSearchResultRepoDO> {
        return new Promise<InvoiceGroupSearchResultRepoDO>((resolve: { (result: InvoiceGroupSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.linkBookingPricesToInvoiceGroupList(invoiceGroupMeta, invoiceGroupSearchResult.invoiceGroupList).then((invoiceGroupList: InvoiceGroupDO[]) => {
                invoiceGroupSearchResult.invoiceGroupList = invoiceGroupList;
                resolve(invoiceGroupSearchResult);
            }).catch((err: ThError) => {
                reject(err);
            });
        });
    }

    private linkBookingPricesToInvoiceGroupList(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupList: InvoiceGroupDO[]): Promise<InvoiceGroupDO[]> {
        return new Promise<InvoiceGroupDO[]>((resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: ThError): void }) => {
            this.linkBookingPricesToInvoiceGroupListCore(resolve, reject, invoiceGroupMeta, invoiceGroupList);
        });
    }

    private linkBookingPricesToInvoiceGroupListCore(resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: ThError): void }, invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupList: InvoiceGroupDO[]) {
        this._bookingsRepo.getBookingList(this.buildBookingMetaFromInvoiceGroupMeta(invoiceGroupMeta), this.buildBookingListSearchCriteria(invoiceGroupList)).then((result: BookingSearchResultRepoDO) => {
            var bookingList = result.bookingList;
            _.forEach(invoiceGroupList, (invoiceGroup: InvoiceGroupDO) => {
                var bookingListFilteredByGroupBookingId = _.filter(bookingList, (booking: BookingDO) => {
                    return booking.groupBookingId === invoiceGroup.groupBookingId;
                });
                if (!_.isEmpty(bookingListFilteredByGroupBookingId)) {
                    invoiceGroup.linkBookingPrices(bookingListFilteredByGroupBookingId);
                }
            });
            return this.addInvoiceFeeIfNecessary(invoiceGroupMeta, invoiceGroupList);
        }).then((invoiceGroupList: InvoiceGroupDO[]) => {
            resolve(invoiceGroupList);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.InvoiceGroupsRepositoryBookingPriceLinkError, error);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error linking the booking prices with the invoice groups", context, thError);
            reject(thError);
        });
    }

    private addInvoiceFeeIfNecessary(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupList: InvoiceGroupDO[]): Promise<InvoiceGroupDO[]> {
        return new Promise<InvoiceGroupDO[]>((resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: ThError): void }) => {
            this.addInvoiceFeeIfNecessaryCore(resolve, reject, invoiceGroupMeta, invoiceGroupList);
        });
    }

    private addInvoiceFeeIfNecessaryCore(resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: ThError): void }, invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupList: InvoiceGroupDO[]) {

        this._customersRepo.getCustomerList(this.buildCustomerMetaFromInvoiceGroupMeta(invoiceGroupMeta), this.buildPayInvoiceByAgreementCustomerListSearchCriteria(invoiceGroupList)).then((result: CustomerSearchResultRepoDO) => {
            _.forEach(invoiceGroupList, (invoiceGroup: InvoiceGroupDO) => {
                invoiceGroup.addInvoiceFeeIfNecessary(result.customerList);
            });

            resolve(invoiceGroupList);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.InvoiceGroupsRepositoryAddInvoiceFeeError, error);
            ThLogger.getInstance().logError(ThLogLevel.Error, "error adding invoice fee to the invoices if necessary", context, thError);
            reject(thError);
        });
    }

    private buildBookingMetaFromInvoiceGroupMeta(invoidGroupMeta: InvoiceGroupMetaRepoDO): BookingMetaRepoDO {
        return {
            hotelId: invoidGroupMeta.hotelId
        }
    }

    private buildCustomerMetaFromInvoiceGroupMeta(invoidGroupMeta: InvoiceGroupMetaRepoDO): BookingMetaRepoDO {
        return {
            hotelId: invoidGroupMeta.hotelId
        }
    }

    private buildBookingListSearchCriteria(invoiceGroupList: InvoiceGroupDO[]): BookingSearchCriteriaRepoDO {
        var thUtils = new ThUtils();

        return {
            groupBookingIdList: _.chain(invoiceGroupList).map((invoiceGroup: InvoiceGroupDO) => {
                return invoiceGroup.groupBookingId;
            }).filter((groupBookingId: string) => {
                return !thUtils.isUndefinedOrNull(groupBookingId);
            }).value()
        };
    }

    private buildPayInvoiceByAgreementCustomerListSearchCriteria(invoiceGroupList: InvoiceGroupDO[]): CustomerSearchCriteriaRepoDO {
        return {
            customerIdList: _.chain(invoiceGroupList).map((invoiceGroupDO: InvoiceGroupDO) => {
                return invoiceGroupDO.invoiceList;
            }).flatten().map((invoice: InvoiceDO) => {
                return invoice.payerList;
            }).flatten().filter((invoicePayer: InvoicePayerDO) => {
                return invoicePayer.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement;
            }).map((invoicePayer: InvoicePayerDO) => {
                return invoicePayer.customerId;
            }).value()
        };
    }
}