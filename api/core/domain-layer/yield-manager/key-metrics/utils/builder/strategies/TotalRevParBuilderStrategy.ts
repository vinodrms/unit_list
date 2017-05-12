import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from '../../values/IKeyMetricValue';
import { PriceKeyMetric } from '../../values/PriceKeyMetric';

import _ = require('underscore');

export class TotalRevParBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.TotalRevPar;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Price;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        let metric = new PriceKeyMetric();
        let totalNoOfRooms = 0;
        let totalRoomRevenue = 0;
        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            totalNoOfRooms += statsForDate.totalInventory.noOfRooms;
            totalRoomRevenue += statsForDate.confirmedRevenue.roomRevenue + statsForDate.guaranteedRevenue.roomRevenue;
        });
        if (totalNoOfRooms == 0) {
            metric.price = 0.0;
            return metric;
        }
        metric.price = this.roundValueToNearestInteger(totalRoomRevenue / totalNoOfRooms);
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "RevPar Total";
    }
}