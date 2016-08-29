import {IHotelInventoryStats, HotelInventoryStatsForDate} from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import {AMetricBuilderStrategy} from '../AMetricBuilderStrategy';
import {KeyMetricType} from '../../KeyMetricType';
import {IKeyMetricValue, KeyMetricValueType, PriceKeyMetric} from '../../KeyMetricsResult';

export class RoomRevenueBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.RoomRevenue;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Price;
    }
    protected getKeyMetricValueCore(statsForDate: HotelInventoryStatsForDate): IKeyMetricValue {
        var metric = new PriceKeyMetric();
        metric.price = this.roundValue(statsForDate.confirmedRevenue.roomRevenue + statsForDate.guaranteedRevenue.roomRevenue);
        return metric;
    }
}