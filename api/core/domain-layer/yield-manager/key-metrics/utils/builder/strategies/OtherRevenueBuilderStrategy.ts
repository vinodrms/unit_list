import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from '../../values/IKeyMetricValue';
import { PriceKeyMetric } from '../../values/PriceKeyMetric';

import _ = require('underscore');

export class OtherRevenueBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats,  private _excludeCommission) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.OtherRevenue;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Price;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        let metric = new PriceKeyMetric();
        metric.price = 0;
        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            let confirmedRevenue = this._excludeCommission? statsForDate.confirmedRevenueWithoutCommission : statsForDate.confirmedRevenue;
            let guaranteedRevenue = this._excludeCommission? statsForDate.guaranteedRevenueWithoutCommission : statsForDate.guaranteedRevenue;
            metric.price += confirmedRevenue.otherRevenue + guaranteedRevenue.otherRevenue;
        });
        metric.price = this.roundValueToNearestInteger(metric.price);
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "Other Revenue Total" + ((this._excludeCommission) ? " W/O Commission" : "");
    }
}