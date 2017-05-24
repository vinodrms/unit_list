import { IInvoiceStats } from './IInvoiceStats';
import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { RevenueForDate } from '../../data-objects/revenue/RevenueForDate';

import _ = require('underscore');

export class InvoiceStats implements IInvoiceStats {
    private _indexedRevenueByDate: { [index: number]: RevenueForDate; } = {};
    private _bookingIdWithInvoiceLossAcceptedByManagementMap: { [index: string]: boolean; } = {};

    constructor() {
        this._indexedRevenueByDate = {};
        this._bookingIdWithInvoiceLossAcceptedByManagementMap = {};
    }

    public indexRevenueForDate(revenueForDate: RevenueForDate, thDate: ThDateDO) {
        this._indexedRevenueByDate[thDate.getUtcTimestamp()] = revenueForDate;
    }
    public indexBookingLossAcceptedByManagement(bookingId: string) {
        this._bookingIdWithInvoiceLossAcceptedByManagementMap[bookingId] = true;
    }

    public getRevenueForDate(thDate: ThDateDO): RevenueForDate {
        return this._indexedRevenueByDate[thDate.getUtcTimestamp()];
    }
    public bookingHasInvoiceWithLossAcceptedByManagement(bookingId: string): boolean {
        var isLostAcceptedByManagement = this._bookingIdWithInvoiceLossAcceptedByManagementMap[bookingId];
        if (!_.isBoolean(isLostAcceptedByManagement)) {
            return false;
        }
        return isLostAcceptedByManagement;
    }
    public destroy() {
        this._indexedRevenueByDate = {};
    }
}