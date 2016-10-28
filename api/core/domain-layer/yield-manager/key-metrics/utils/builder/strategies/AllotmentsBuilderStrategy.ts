import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType, InventoryKeyMetric } from '../../KeyMetricsResult';

export class AllotmentsBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.Allotments;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Inventory;
    }
    protected getKeyMetricValueCore(statsForDate: HotelInventoryStatsForDate): IKeyMetricValue {
        var metric = new InventoryKeyMetric();
        metric.total = statsForDate.totalInventory.noOfRoomsWithAllotment;
        var occupied = statsForDate.confirmedOccupancy.getTotalAllotmentOccupancy() + statsForDate.guaranteedOccupancy.getTotalAllotmentOccupancy();
        metric.available = metric.total - occupied;
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return "Allotments";
    }
}