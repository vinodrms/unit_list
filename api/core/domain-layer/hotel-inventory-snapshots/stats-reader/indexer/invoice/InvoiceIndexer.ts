import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {IInvoiceStats} from './IInvoiceStats';
import {InvoiceStats} from './InvoiceStats';
import {IndexedBookingInterval} from '../../../../../data-layer/price-products/utils/IndexedBookingInterval';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {InvoiceGroupSearchResultRepoDO} from '../../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';
import {InvoiceGroupDO} from '../../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceDO} from '../../../../../data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceItemDO, InvoiceItemType} from '../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import {RevenueForDate} from '../../data-objects/revenue/RevenueForDate';

import _ = require('underscore');

export class InvoiceIndexer {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getInvoiceStats(indexedInterval: IndexedBookingInterval): Promise<IInvoiceStats> {
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
                var invoiceStats = this.getIndexedInvoiceStats(indexedInterval, invoiceSearchResult.invoiceGroupList);
                resolve(invoiceStats);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.InvoiceIndexerError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error indexing invoices", { interval: indexedInterval.indexedBookingInterval, session: this._sessionContext.sessionDO }, thError);
                }
                reject(thError);
            });
    }

    private getIndexedInvoiceStats(indexedInterval: IndexedBookingInterval, invoiceGroupList: InvoiceGroupDO[]): IInvoiceStats {
        var invoiceStats = new InvoiceStats();
        _.forEach(indexedInterval.bookingDateList, (thDate: ThDateDO) => {
            var revenueForDate = this.getRevenueForDate(thDate, invoiceGroupList);
            invoiceStats.indexRevenueForDate(revenueForDate, thDate);
        });
        return invoiceStats;
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
                otherRevenue += item.meta.getNumberOfItems() * item.meta.getPrice();
            }
        });
        return otherRevenue;
    }
}