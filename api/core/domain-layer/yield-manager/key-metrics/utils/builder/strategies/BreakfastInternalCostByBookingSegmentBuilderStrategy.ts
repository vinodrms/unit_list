import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from '../../values/IKeyMetricValue';
import { PriceKeyMetric } from '../../values/PriceKeyMetric';
import { IMetricBuilderInput } from "../IMetricBuilderStrategy";

import _ = require('underscore');

export class BreakfastInternalCostByBookingSegmentBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats, private input: IMetricBuilderInput) {
        super(hotelInventoryStats, input);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.BreakfastInternalCostByBookingSegment;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Price;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        let metric = new PriceKeyMetric();
        metric.price = 0;
        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            metric.price += statsForDate.breakfastInternalCost[this._input.revenueSegment].cost;
        });
        metric.price = this.roundValueToNearestInteger(metric.price);
        return metric;
    }
    protected getKeyMetricName(): string {
        return "Breakfast Internal Cost Total";
    }
}