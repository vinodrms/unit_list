import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from '../../values/IKeyMetricValue';
import { PriceKeyMetric } from '../../values/PriceKeyMetric';

import _ = require('underscore');

export class ConfirmedRevenueBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.ConfirmedRevenue;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Price;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        let metric = new PriceKeyMetric();
        metric.price = 0;
        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            metric.price += statsForDate.confirmedRevenue.roomRevenue + statsForDate.confirmedRevenue.otherRevenue;
        });
        metric.price = this.roundValueToNearestInteger(metric.price);
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "Room Revenue Confirmed";
    }
}