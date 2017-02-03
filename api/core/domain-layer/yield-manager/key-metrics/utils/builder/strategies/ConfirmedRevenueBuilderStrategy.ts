import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType, PriceKeyMetric } from '../../KeyMetricsResult';

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
    protected getKeyMetricValueCore(statsForDate: HotelInventoryStatsForDate): IKeyMetricValue {
        var metric = new PriceKeyMetric();
        metric.price = this.roundValueToNearestInteger(statsForDate.confirmedRevenue.roomRevenue + statsForDate.confirmedRevenue.otherRevenue);
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "Confirmed Revenue";
    }
}