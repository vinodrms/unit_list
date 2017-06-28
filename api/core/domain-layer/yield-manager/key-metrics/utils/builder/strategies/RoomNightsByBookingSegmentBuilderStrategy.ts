import { AMetricBuilderStrategy } from "../AMetricBuilderStrategy";
import { IHotelInventoryStats, HotelInventoryStatsForDate } from "../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats";
import { CountryDO } from "../../../../../../data-layer/common/data-objects/country/CountryDO";
import { IMetricBuilderInput } from "../IMetricBuilderStrategy";
import { KeyMetricType } from "../../KeyMetricType";
import { KeyMetricValueType, IKeyMetricValue } from "../../values/IKeyMetricValue";
import { CounterKeyMetric } from "../../values/CounterKeyMetric";
import { BookingSegment } from "../../../../../hotel-inventory-snapshots/stats-reader/data-objects/utils/BookingSegment";

import _ = require('underscore');

export class RoomNightsByBookingSegmentBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats, private _segment: BookingSegment, 
        input: IMetricBuilderInput) {
        super(hotelInventoryStats, input);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.RoomNightsByBookingSegment;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Counter;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        var metric = new CounterKeyMetric();
        metric.total = 0;

        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            let confirmedRoomNights = statsForDate.confirmedRoomNights.roomNightsByBookingSegment[this._segment];
            let guaranteedRoomNights = statsForDate.guaranteedRoomNights.roomNightsByBookingSegment[this._segment];

            let total = (_.isNumber(confirmedRoomNights)? confirmedRoomNights : 0) 
                + (_.isNumber(guaranteedRoomNights)? guaranteedRoomNights : 0);

            metric.total += total;
        });
        return metric;
    }
    protected getKeyMetricName(): string {
        switch(this._segment) {
            case BookingSegment.BusinessGroup: return "Business Group";
            case BookingSegment.BusinessIndividual: return "Business Individual";
            case BookingSegment.LeisureGroup: return "Leisure Group";
            case BookingSegment.LeisureIndividual: return "Leisure Individual";
            default: return "";
        }
    }
}