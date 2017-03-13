import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from '../../values/IKeyMetricValue';
import { PercentageKeyMetric } from '../../values/PercentageKeyMetric';

export class TotalOccupancyBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.TotalOccupancy;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Percentage;
    }
    protected getKeyMetricValueCore(statsForDate: HotelInventoryStatsForDate): IKeyMetricValue {
        var metric = new PercentageKeyMetric();
        var totalNoOfRooms = statsForDate.totalInventory.noOfRooms;
        if (totalNoOfRooms == 0) {
            metric.percentage = 0.0;
            return metric;
        }
        var noOccupiedRooms = statsForDate.confirmedOccupancy.getTotalRoomOccupancy() + statsForDate.guaranteedOccupancy.getTotalRoomOccupancy();
        metric.percentage = this.roundValue(noOccupiedRooms / totalNoOfRooms);
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "Occupancy Total";
    }
}