import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from '../../values/IKeyMetricValue';
import { PriceKeyMetric } from '../../values/PriceKeyMetric';

import _ = require('underscore');

export class TotalAvgRateBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats, private _excludeCommission) {
        super(hotelInventoryStats);
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
            let confirmedRevenue = this._excludeCommission? statsForDate.confirmedRevenueWithoutCommission : statsForDate.confirmedRevenue;
            let guaranteedRevenue = this._excludeCommission? statsForDate.guaranteedRevenueWithoutCommission : statsForDate.guaranteedRevenue;

            totalNoOccupiedRooms += statsForDate.confirmedOccupancy.getTotalRoomOccupancy() + statsForDate.guaranteedOccupancy.getTotalRoomOccupancy();
            totalRoomRevenue += confirmedRevenue.roomRevenue + guaranteedRevenue.roomRevenue;
        });
        if (totalNoOccupiedRooms == 0) {
            metric.price = 0.0;
            return metric;
        }
        metric.price = this.roundValueToNearestInteger(totalRoomRevenue / totalNoOccupiedRooms);
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "AvgRate Total" + ((this._excludeCommission) ? AMetricBuilderStrategy.WithoutCommissionSuffixDisplayString: "");
    }
}