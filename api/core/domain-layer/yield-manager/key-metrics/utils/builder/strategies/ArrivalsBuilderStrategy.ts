

import { AMetricBuilderStrategy } from "../AMetricBuilderStrategy";
import { IHotelInventoryStats, HotelInventoryStatsForDate } from "../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats";
import { IMetricBuilderInput } from "../IMetricBuilderStrategy";
import { KeyMetricType } from "../../KeyMetricType";
import { KeyMetricValueType, IKeyMetricValue } from "../../values/IKeyMetricValue";
import { CounterKeyMetric } from "../../values/CounterKeyMetric";

import _ = require('underscore');

export class ArrivalsBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats, input: IMetricBuilderInput) {
        super(hotelInventoryStats, input);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.Arrivals;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Counter;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        var metric = new CounterKeyMetric();
        metric.total = 0;
        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            let total = statsForDate.confirmedArrivals.totalNoOfArrivals + statsForDate.guaranteedArrivals.totalNoOfArrivals;
            metric.total += total;
        });
        
        return metric;
    }

    protected getKeyMetricName(): string {
        return "Total arrivals";
    }
}