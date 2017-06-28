import { AMetricBuilderStrategy } from "../AMetricBuilderStrategy";
import { IHotelInventoryStats, HotelInventoryStatsForDate } from "../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats";
import { CountryDO } from "../../../../../../data-layer/common/data-objects/country/CountryDO";
import { IMetricBuilderInput } from "../IMetricBuilderStrategy";
import { KeyMetricType } from "../../KeyMetricType";
import { KeyMetricValueType, IKeyMetricValue } from "../../values/IKeyMetricValue";
import { CounterKeyMetric } from "../../values/CounterKeyMetric";
import { BookingSegment, BookingSegmentDisplayName } from "../../../../../hotel-inventory-snapshots/stats-reader/data-objects/utils/BookingSegment";

import _ = require('underscore');

export class GuestNightsByBookingSegmentBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats, private _segment: BookingSegment, 
        input: IMetricBuilderInput) {
        super(hotelInventoryStats, input);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.GuestNightsByBookingSegment;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Counter;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        var metric = new CounterKeyMetric();
        metric.total = 0;

        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            let confirmedGuestNights = statsForDate.confirmedGuestNights.guestsByBookingSegment[this._segment];
            let guaranteedGuestNights = statsForDate.guaranteedGuestNights.guestsByBookingSegment[this._segment];

            let total = (_.isNumber(confirmedGuestNights)? confirmedGuestNights : 0) 
                + (_.isNumber(guaranteedGuestNights)? guaranteedGuestNights : 0);

            metric.total += total;
        });
        return metric;
    }
    protected getKeyMetricName(): string {
        switch(this._segment) {
            case BookingSegment.BusinessGroup: return BookingSegmentDisplayName.BusinessGroup;
            case BookingSegment.BusinessIndividual: return BookingSegmentDisplayName.BusinessIndividual;
            case BookingSegment.LeisureGroup: return BookingSegmentDisplayName.LeisureGroup;
            case BookingSegment.LeisureIndividual: return BookingSegmentDisplayName.LeisureIndividual;
            default: return "";
        }
    }
}