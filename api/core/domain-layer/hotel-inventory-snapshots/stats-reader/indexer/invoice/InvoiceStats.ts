import {IInvoiceStats} from './IInvoiceStats';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {RevenueForDate} from '../../data-objects/revenue/RevenueForDate';

import _ = require('underscore');

export class InvoiceStats implements IInvoiceStats {
    private _indexedRevenueByDate: { [index: number]: RevenueForDate; } = {};

    constructor() {
        this._indexedRevenueByDate = {};
    }

    public indexRevenueForDate(revenueForDate: RevenueForDate, thDate: ThDateDO) {
        this._indexedRevenueByDate[thDate.getUtcTimestamp()] = revenueForDate;
    }

    public getRevenueForDate(thDate: ThDateDO): RevenueForDate {
        return this._indexedRevenueByDate[thDate.getUtcTimestamp()];
    }
    public destroy() {
        this._indexedRevenueByDate = {};
    }
}