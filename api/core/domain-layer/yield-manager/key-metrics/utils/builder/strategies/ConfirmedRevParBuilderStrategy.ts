import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType, PriceKeyMetric } from '../../KeyMetricsResult';

export class ConfirmedRevParBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.ConfirmedRevPar;
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
        var roomRevenue = statsForDate.confirmedRevenue.roomRevenue;
        metric.price = this.roundValue(roomRevenue / totalNoOfRooms);
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "Confirmed RevPar";
    }
}