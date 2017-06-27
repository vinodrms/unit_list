import { AMetricBuilderStrategy } from "../AMetricBuilderStrategy";
import { IHotelInventoryStats, HotelInventoryStatsForDate } from "../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats";
import { CountryDO } from "../../../../../../data-layer/common/data-objects/country/CountryDO";
import { IMetricBuilderInput } from "../IMetricBuilderStrategy";
import { KeyMetricType } from "../../KeyMetricType";
import { KeyMetricValueType, IKeyMetricValue } from "../../values/IKeyMetricValue";
import { CounterKeyMetric } from "../../values/CounterKeyMetric";

import _ = require('underscore');

export class ArrivalsByNationalityBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats, private _country: CountryDO,
        input: IMetricBuilderInput) {
        super(hotelInventoryStats, input);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.ArrivalsByNationality;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Counter;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        var metric = new CounterKeyMetric();
        metric.total = 0;

        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            let confirmedArrivals = statsForDate.confirmedArrivals.arrivalsByNationality[this._country.code];
            let guaranteedArrivals = statsForDate.guaranteedArrivals.arrivalsByNationality[this._country.code];

            let total = (_.isNumber(confirmedArrivals) ? confirmedArrivals : 0)
                + (_.isNumber(guaranteedArrivals) ? guaranteedArrivals : 0);

            metric.total += total;
        });
        return metric;
    }
    protected getKeyMetricName(): string {
        return this._country.name;
    }
}