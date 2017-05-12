import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from '../../values/IKeyMetricValue';
import { PercentageKeyMetric } from '../../values/PercentageKeyMetric';

import _ = require('underscore');

export class TotalOccupancyBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.TotalOccupancy;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Percentage;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        var metric = new PercentageKeyMetric();
        metric.percentage = 0.0;
        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            var totalNoOfRooms = statsForDate.totalInventory.noOfRooms;
            if (totalNoOfRooms == 0) {
                return;
            }
            var noOccupiedRooms = statsForDate.confirmedOccupancy.getTotalRoomOccupancy() + statsForDate.guaranteedOccupancy.getTotalRoomOccupancy();
            metric.percentage += noOccupiedRooms / totalNoOfRooms;
        });
        metric.percentage = this.roundValue(metric.percentage) / statsForDateList.length;
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "Occupancy Total";
    }
}