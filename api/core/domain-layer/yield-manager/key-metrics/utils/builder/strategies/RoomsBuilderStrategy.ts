import {IHotelInventoryStats, HotelInventoryStatsForDate} from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import {AMetricBuilderStrategy} from '../AMetricBuilderStrategy';
import {KeyMetricType} from '../../KeyMetricType';
import {IKeyMetricValue, KeyMetricValueType, InventoryKeyMetric} from '../../KeyMetricsResult';

export class RoomsBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.Rooms;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Inventory;
    }
    protected getKeyMetricValueCore(statsForDate: HotelInventoryStatsForDate): IKeyMetricValue {
        var metric = new InventoryKeyMetric();
        metric.total = statsForDate.totalInventory.noOfRooms;
        var occupied = statsForDate.confirmedOccupancy.getTotalRoomOccupancy() + statsForDate.guaranteedOccupancy.getTotalRoomOccupancy();
        metric.available = metric.total - occupied;
        return metric;
    }
}