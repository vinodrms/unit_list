import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType, InventoryKeyMetric } from '../../KeyMetricsResult';
import { RoomCategoryStatsDO } from '../../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';

export class RoomCategoryBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats, private _roomCategoryStats: RoomCategoryStatsDO) {
        super(hotelInventoryStats);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.RoomCategory;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Inventory;
    }
    protected getKeyMetricValueCore(statsForDate: HotelInventoryStatsForDate): IKeyMetricValue {
        var metric = new InventoryKeyMetric();
        var roomCategoryId = this._roomCategoryStats.roomCategory.id;
        metric.total = statsForDate.totalInventory.getNumberOfRoomsFor(roomCategoryId);
        var occupied = statsForDate.confirmedOccupancy.getOccupancyForRoomCategoryId(roomCategoryId) + statsForDate.guaranteedOccupancy.getOccupancyForRoomCategoryId(roomCategoryId);
        metric.available = metric.total - occupied;
        return metric;
    }
    protected getKeyMetricDisplayName(): string {
        return this._roomCategoryStats.roomCategory.displayName;
    }
}