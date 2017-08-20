import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from '../../values/IKeyMetricValue';
import { PriceKeyMetric } from '../../values/PriceKeyMetric';
import { IMetricBuilderInput } from "../IMetricBuilderStrategy";

import _ = require('underscore');

export class TotalAvgRateBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats, input: IMetricBuilderInput) {
        super(hotelInventoryStats, input);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.TotalAvgRate;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Price;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        let metric = new PriceKeyMetric();
        let totalNoOccupiedRooms = 0;
        let totalRoomRevenue = 0;
        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            let confirmedRevenue = this._input.excludeCommission? statsForDate.confirmedRevenueWithoutCommission : statsForDate.confirmedRevenue;
            let guaranteedRevenue = this._input.excludeCommission? statsForDate.guaranteedRevenueWithoutCommission : statsForDate.guaranteedRevenue;

            totalNoOccupiedRooms += statsForDate.confirmedOccupancy[this._input.revenueSegment].getTotalRoomOccupancy() + statsForDate.guaranteedOccupancy[this._input.revenueSegment].getTotalRoomOccupancy();
            totalRoomRevenue += confirmedRevenue[this._input.revenueSegment].revenue.roomRevenue 
                + guaranteedRevenue[this._input.revenueSegment].revenue.roomRevenue;
            
        });
        if (totalNoOccupiedRooms == 0) {
            metric.price = 0.0;
            return metric;
        }
        metric.price = this.roundValueToNearestInteger(totalRoomRevenue / totalNoOccupiedRooms);
        return metric;
    }
    protected getKeyMetricName(): string {
        return "AvgRate Total";
    }
}