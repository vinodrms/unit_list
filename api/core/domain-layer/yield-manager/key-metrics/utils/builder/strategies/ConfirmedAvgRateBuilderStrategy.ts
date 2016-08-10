import {IHotelInventoryStats, HotelInventoryStatsForDate} from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import {AMetricBuilderStrategy} from '../AMetricBuilderStrategy';
import {KeyMetricType} from '../../KeyMetricType';
import {IKeyMetricValue, KeyMetricValueType, PriceKeyMetric} from '../../KeyMetricsResult';

export class ConfirmedAvgRateBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.ConfirmedAvgRate;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Price;
    }
    protected getKeyMetricValueCore(statsForDate: HotelInventoryStatsForDate): IKeyMetricValue {
        var metric = new PriceKeyMetric();
        var noOccupiedRooms = statsForDate.confirmedOccupancy.getTotalRoomOccupancy();
        if (noOccupiedRooms == 0) {
            metric.price = 0.0;
            return metric;
        }
        var roomRevenue = statsForDate.confirmedRevenue.roomRevenue;
        metric.price = this.roundValue(roomRevenue / noOccupiedRooms);
        return metric;
    }
}