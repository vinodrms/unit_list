import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType, PriceKeyMetric } from '../../KeyMetricsResult';

export class TotalAvgRateBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.TotalAvgRate;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Price;
    }
    protected getKeyMetricValueCore(statsForDate: HotelInventoryStatsForDate): IKeyMetricValue {
        var metric = new PriceKeyMetric();
        var noOccupiedRooms = statsForDate.confirmedOccupancy.getTotalRoomOccupancy() + statsForDate.guaranteedOccupancy.getTotalRoomOccupancy();
        if (noOccupiedRooms == 0) {
            metric.price = 0.0;
            return metric;
        }
        var roomRevenue = statsForDate.confirmedRevenue.roomRevenue + statsForDate.guaranteedRevenue.roomRevenue;
        metric.price = this.roundValueToNearestInteger(roomRevenue / noOccupiedRooms);
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "Total AvgRate";
    }
}