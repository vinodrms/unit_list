import {IHotelInventoryStats, HotelInventoryStatsForDate} from './IHotelInventoryStats';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';

import _ = require('underscore');

export class HotelInventoryStats implements IHotelInventoryStats {
    private _indexedInventoryByDate: { [index: number]: HotelInventoryStatsForDate; } = {};

    constructor() {
        this._indexedInventoryByDate = {};
    }

    public indexHotelInventoryForDate(inventoryForDate: HotelInventoryStatsForDate, thDate: ThDateDO) {
        this._indexedInventoryByDate[thDate.getUtcTimestamp()] = inventoryForDate;
    }

    public getInventoryStatsForDate(thDate: ThDateDO): HotelInventoryStatsForDate {
        return this._indexedInventoryByDate[thDate.getUtcTimestamp()];
    }
}