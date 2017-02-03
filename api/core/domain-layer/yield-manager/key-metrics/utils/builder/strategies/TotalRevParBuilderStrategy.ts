import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType, PriceKeyMetric } from '../../KeyMetricsResult';

export class TotalRevParBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.TotalRevPar;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Price;
    }
    protected getKeyMetricValueCore(statsForDate: HotelInventoryStatsForDate): IKeyMetricValue {
        var metric = new PriceKeyMetric();
        var totalNoOfRooms = statsForDate.totalInventory.noOfRooms;
        if (totalNoOfRooms == 0) {
            metric.price = 0.0;
            return metric;
        }
        var roomRevenue = statsForDate.confirmedRevenue.roomRevenue + statsForDate.guaranteedRevenue.roomRevenue;
        metric.price = this.roundValueToNearestInteger(roomRevenue / totalNoOfRooms);
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "Total RevPar";
    }
}