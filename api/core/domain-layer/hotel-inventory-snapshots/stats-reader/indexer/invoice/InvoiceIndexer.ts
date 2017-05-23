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
import { InvoiceGroupSearchResultRepoDO } from '../../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';
import { InvoiceGroupDO } from '../../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoiceDO, InvoicePaymentStatus } from '../../../../../data-layer/invoices/data-objects/InvoiceDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import { RevenueForDate } from '../../data-objects/revenue/RevenueForDate';
import { TaxDO } from "../../../../../data-layer/taxes/data-objects/TaxDO";
import { ThUtils } from "../../../../../utils/ThUtils";

import _ = require('underscore');

export class InvoiceIndexer {
    private _bookingIdList: string[];
    private _indexedVatById: { [id: string]: TaxDO; };
    private _excludeVat: boolean;
    
    private _invoicesPaidInIndexedInterval: InvoiceGroupDO[];
    private _invoicesLossByManagement: InvoiceGroupDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getInvoiceStats(indexedInterval: IndexedBookingInterval, bookingIdList: string[], indexedVatById: { [id: string]: TaxDO; }, excludeVat: boolean): Promise<IInvoiceStats> {
        this._indexedVatById = indexedVatById;
        this._bookingIdList = bookingIdList;
        this._excludeVat = excludeVat;

        return new Promise<IInvoiceStats>((resolve: { (result: IInvoiceStats): void }, reject: { (err: ThError): void }) => {
            this.getInvoiceStatsCore(resolve, reject, indexedInterval);
        });
    }

    private getInvoiceStatsCore(resolve: { (result: IInvoiceStats): void }, reject: { (err: ThError): void }, indexedInterval: IndexedBookingInterval) {
        var invoiceGroupsRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
        invoiceGroupsRepo.getInvoiceGroupList({ hotelId: this._sessionContext.sessionDO.hotel.id },
            {
                paidInterval: ThDateIntervalDO.buildThDateIntervalDO(
                    indexedInterval.getArrivalDate().buildPrototype(),
                    indexedInterval.getDepartureDate().buildPrototype()
                )
            }).then((invoiceSearchResult: InvoiceGroupSearchResultRepoDO) => {
                this._invoicesPaidInIndexedInterval = invoiceSearchResult.invoiceGroupList;

                return invoiceGroupsRepo.getInvoiceGroupList({ hotelId: this._sessionContext.sessionDO.hotel.id },
                {
                    bookingIdList: this._bookingIdList,
                    invoicePaymentStatus: InvoicePaymentStatus.LossAcceptedByManagement
                });
            }).then((invoiceSearchResult: InvoiceGroupSearchResultRepoDO) => {
                this._invoicesLossByManagement = invoiceSearchResult.invoiceGroupList;

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
        _.forEach(this._invoicesLossByManagement, (invoiceGroup: InvoiceGroupDO) => {
            _.forEach(invoiceGroup.invoiceList, (invoice: InvoiceDO) => {
                if (invoice.isLossAcceptedByManagement() && _.isString(invoice.bookingId) && invoice.bookingId.length > 0) {
                    invoiceStats.indexBookingLossAcceptedByManagement(invoice.bookingId);
                }
            });
        });
    }

    private getRevenueForDate(thDate: ThDateDO, invoiceGroupList: InvoiceGroupDO[]): RevenueForDate {
        var revenue = new RevenueForDate(0.0, 0.0);
        var thDateUtcTimestamp = thDate.getUtcTimestamp();
        _.forEach(invoiceGroupList, (invoiceGroup: InvoiceGroupDO) => {
            _.forEach(invoiceGroup.invoiceList, (invoice: InvoiceDO) => {
                if (thDateUtcTimestamp === invoice.paidDateUtcTimestamp && invoice.isPaid()) {
                    revenue.otherRevenue += this.getOtherRevenueFrom(invoice);
                }
            });
        });
        return revenue;
    }
    private getOtherRevenueFrom(invoice: InvoiceDO): number {
        var otherRevenue = 0.0;
        _.forEach(invoice.itemList, (item: InvoiceItemDO) => {
            if (item.type === InvoiceItemType.AddOnProduct) {
                otherRevenue += (this._excludeVat)?  
                    this.getNetValue(item.meta.getVatId(), item.getTotalPrice()) : item.getTotalPrice();
            }
        });
        return otherRevenue;
    }

    private getNetValue(vatId: string, price: number): number {
        let vat = this._indexedVatById[vatId];

        let thUtils = new ThUtils();
        if(thUtils.isUndefinedOrNull(vat)) {
            return price;
        }

        return vat.getNetValue(price);
    } 
}