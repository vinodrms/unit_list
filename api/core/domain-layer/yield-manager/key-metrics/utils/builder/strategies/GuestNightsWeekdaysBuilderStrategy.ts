
import { IHotelInventoryStats, HotelInventoryStatsForDate } from "../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats";
import { IMetricBuilderInput } from "../IMetricBuilderStrategy";
import { AMetricBuilderStrategy } from "../AMetricBuilderStrategy";
import { KeyMetricType } from "../../KeyMetricType";
import { KeyMetricValueType, IKeyMetricValue } from "../../values/IKeyMetricValue";
import { CounterKeyMetric } from "../../values/CounterKeyMetric";
import { ISOWeekDay } from "../../../../../../utils/th-dates/data-objects/ISOWeekDay";

import _ = require('underscore');

export class GuestNightsWeekdaysBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats, input: IMetricBuilderInput) {
        super(hotelInventoryStats, input);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.GuestNightsWeekdays;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Counter;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        let metric = new CounterKeyMetric();
        metric.total = 0;
        
        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            if(statsForDate.date.isWeekendDay()) {
                return;
            }

            let total = statsForDate.confirmedGuestNights.totalNoOfGuests + statsForDate.guaranteedGuestNights.totalNoOfGuests;
            metric.total += total;
        });
        
        return metric;
    }

    protected getKeyMetricName(): string {
        return "Guest Nights Weekdays Total";
    }
}