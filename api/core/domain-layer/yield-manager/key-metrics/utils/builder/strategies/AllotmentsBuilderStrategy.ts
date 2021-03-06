import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from '../../values/IKeyMetricValue';
import { InventoryKeyMetric } from '../../values/InventoryKeyMetric';
import { IMetricBuilderInput } from "../IMetricBuilderStrategy";

import _ = require('underscore');

export class AllotmentsBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats, input: IMetricBuilderInput) {
        super(hotelInventoryStats, input);
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
        metric.available = 0; 
        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            let total = statsForDate.totalInventory.noOfRoomsWithAllotment;
            let occupied = statsForDate.confirmedOccupancy[this._input.revenueSegment].getTotalAllotmentOccupancy() + statsForDate.guaranteedOccupancy[this._input.revenueSegment].getTotalAllotmentOccupancy();
            let available = total - occupied;
            metric.total += total;
            metric.available += available;
        });
        return metric;
    }
    protected getKeyMetricName(): string {
        return "Allotments Total";
    }
}