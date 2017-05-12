import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from '../../values/IKeyMetricValue';
import { InventoryKeyMetric } from '../../values/InventoryKeyMetric';

import _ = require('underscore');

export class AllotmentsBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.Allotments;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Inventory;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        var metric = new InventoryKeyMetric();        
        metric.total = 0;
        metric.available = 0;        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            let total = statsForDate.totalInventory.noOfRoomsWithAllotment;
            let occupied = statsForDate.confirmedOccupancy.getTotalAllotmentOccupancy() + statsForDate.guaranteedOccupancy.getTotalAllotmentOccupancy();
            let available = total - occupied;
            metric.total += total;
            metric.available += available;
        });
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "Allotments Total";
    }
}