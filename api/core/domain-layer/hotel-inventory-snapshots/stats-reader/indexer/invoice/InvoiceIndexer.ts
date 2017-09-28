import _ = require('underscore');
import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../../utils/AppContext';
import { SessionContext } from '../../../../../utils/SessionContext';
import { IInvoiceStats } from './IInvoiceStats';
import { InvoiceStats } from './InvoiceStats';
import { IndexedBookingInterval } from '../../../../../data-layer/price-products/utils/IndexedBookingInterval';
import { ThDateIntervalDO } from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { RevenueForDate } from '../../data-objects/revenue/RevenueForDate';
import { TaxDO } from "../../../../../data-layer/taxes/data-objects/TaxDO";
import { ThUtils } from "../../../../../utils/ThUtils";
import { InvoiceDO, InvoicePaymentStatus } from '../../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoiceSearchResultRepoDO } from '../../../../../data-layer/invoices/repositories/IInvoiceRepository';
import { ThDateUtils } from '../../../../../utils/th-dates/ThDateUtils';
import { HotelDO } from '../../../../../data-layer/hotel/data-objects/HotelDO';
import { InvoicePayerDO } from '../../../../../data-layer/invoices/data-objects/payer/InvoicePayerDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO';

export class InvoiceIndexer {
    private _dateUtils: ThDateUtils;
    private _bookingIdList: string[];
    private _indexedVatById: { [id: string]: TaxDO; };
    private _excludeVat: boolean;
    private _payerCustomerIdList: string[];

    private _invoicesPaidInIndexedInterval: InvoiceDO[];
    private _invoicesLossByManagement: InvoiceDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _hotel: HotelDO) {
        this._dateUtils = new ThDateUtils();
    }

    public getInvoiceStats(indexedInterval: IndexedBookingInterval, bookingIdList: string[], indexedVatById: { [id: string]: TaxDO; }, excludeVat: boolean, payerCustomerIdList?: string[]): Promise<IInvoiceStats> {
        this._indexedVatById = indexedVatById;
        this._bookingIdList = bookingIdList;
        this._excludeVat = excludeVat;
        this._payerCustomerIdList = payerCustomerIdList;

        return new Promise<IInvoiceStats>((resolve: { (result: IInvoiceStats): void }, reject: { (err: ThError): void }) => {
            this.getInvoiceStatsCore(resolve, reject, indexedInterval);
        });
    }

    private getInvoiceStatsCore(resolve: { (result: IInvoiceStats): void }, reject: { (err: ThError): void }, indexedInterval: IndexedBookingInterval) {
        var invoiceRepo = this._appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepo.getInvoiceList({ hotelId: this._sessionContext.sessionDO.hotel.id },
            {
                paidInterval: ThDateIntervalDO.buildThDateIntervalDO(
                    _.first(indexedInterval.bookingDateList).buildPrototype(),
                    _.last(indexedInterval.bookingDateList).buildPrototype()
                ),
                payerCustomerIdList: this._payerCustomerIdList
            }).then((invoiceSearchResult: InvoiceSearchResultRepoDO) => {
                this._invoicesPaidInIndexedInterval = invoiceSearchResult.invoiceList;

                return invoiceRepo.getInvoiceList({ hotelId: this._sessionContext.sessionDO.hotel.id },
                    {
                        bookingIdList: this._bookingIdList,
                        invoicePaymentStatus: InvoicePaymentStatus.LossAcceptedByManagement
                    });
            }).then((invoiceSearchResult: InvoiceSearchResultRepoDO) => {
                this._invoicesLossByManagement = invoiceSearchResult.invoiceList;

                var invoiceStats = this.getIndexedInvoiceStats(indexedInterval);
                resolve(invoiceStats);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.InvoiceIndexerError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error indexing invoices", { interval: indexedInterval.indexedBookingInterval, session: this._sessionContext.sessionDO }, thError);
                }
                reject(thError);
            });
    }

    private getIndexedInvoiceStats(indexedInterval: IndexedBookingInterval): IInvoiceStats {
        var invoiceStats = new InvoiceStats();
        _.forEach(indexedInterval.bookingDateList, (thDate: ThDateDO) => {
            var revenueForDate = this.getRevenueForDate(thDate, this._invoicesPaidInIndexedInterval);
            invoiceStats.indexRevenueForDate(revenueForDate, thDate);
        });
        this.indexBookingsLossAcceptedByManagement(invoiceStats);
        return invoiceStats;
    }
    private indexBookingsLossAcceptedByManagement(invoiceStats: InvoiceStats) {
        _.forEach(this._invoicesLossByManagement, (invoice: InvoiceDO) => {
            if (invoice.isLossAcceptedByManagement()) {
                invoice.indexedBookingIdList.forEach(bookingId => {
                    invoiceStats.indexBookingLossAcceptedByManagement(bookingId);
                });
            }
        });
    }

    private getRevenueForDate(thDate: ThDateDO, invoiceList: InvoiceDO[]): RevenueForDate {
        let dateStartTimestamp = thDate.getTimestamp(this._hotel.timezone);
        let nextDate = this._dateUtils.addDaysToThDateDO(thDate, 1);
        let dateEndTimestamp = nextDate.getTimestamp(this._hotel.timezone);

        var revenue = new RevenueForDate(0.0, 0.0, 0.0);
        var thDateUtcTimestamp = thDate.getUtcTimestamp();
        _.forEach(invoiceList, (invoice: InvoiceDO) => {
            if (invoice.isPaid() && _.isNumber(invoice.paidTimestamp)) {
                if (this.invoicePayerInPayerCustomerIdList(invoice)
                    && dateStartTimestamp <= invoice.paidTimestamp
                    && dateEndTimestamp > invoice.paidTimestamp) {
                    revenue.otherRevenue += invoice.getAccountingFactor() * this.getOtherRevenueFrom(invoice);
                }
            }
        });
        return revenue;
    }

    private invoicePayerInPayerCustomerIdList(invoice: InvoiceDO) {
        let thUtils = new ThUtils();
        if (thUtils.isUndefinedOrNull(this._payerCustomerIdList) || this._payerCustomerIdList.length == 0) {
            return true;
        }
        var payersInPayerCustomerIdList = _.filter(invoice.payerList, (payer: InvoicePayerDO) => {
            return _.contains(this._payerCustomerIdList, payer.customerId);
        });
        return payersInPayerCustomerIdList.length > 0;
    }

    private getOtherRevenueFrom(invoice: InvoiceDO): number {
        var otherRevenue = 0.0;
        _.forEach(invoice.itemList, (item: InvoiceItemDO) => {
            if (item.type === InvoiceItemType.AddOnProduct) {
                otherRevenue += (this._excludeVat) ?
                    this.getNetValue(item.meta.getVatId(), item.getTotalPrice()) : item.getTotalPrice();
            }
        });
        return this.getRevenueGeneratedByPayerCustomerIdList(invoice, otherRevenue);
    }

    private getRevenueGeneratedByPayerCustomerIdList(invoice: InvoiceDO, revenue: number): number {
        let thUtils = new ThUtils();
        if (thUtils.isUndefinedOrNull(this._payerCustomerIdList) || this._payerCustomerIdList.length == 0) {
            return revenue;
        }
        var totalRevenueGeneratedByPayerCustomerIdList = 0.0;
        var totalRevenue = 0.0;
        _.forEach(invoice.payerList, (payer: InvoicePayerDO) => {
            totalRevenue += payer.totalAmount;
            var found: string = _.find(this._payerCustomerIdList, (payerId: string) => {
                return payerId === payer.customerId;
            });
            if (found) {
                totalRevenueGeneratedByPayerCustomerIdList += payer.totalAmount;
            }
        });
        return totalRevenueGeneratedByPayerCustomerIdList / totalRevenue * revenue;
    }

    private getNetValue(vatId: string, price: number): number {
        let vat = this._indexedVatById[vatId];

        let thUtils = new ThUtils();
        if (thUtils.isUndefinedOrNull(vat)) {
            return price;
        }

        return vat.getNetValue(price);
    }
}
