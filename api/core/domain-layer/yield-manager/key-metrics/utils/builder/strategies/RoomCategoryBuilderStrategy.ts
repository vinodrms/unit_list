import { IHotelInventoryStats, HotelInventoryStatsForDate } from '../../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { AMetricBuilderStrategy } from '../AMetricBuilderStrategy';
import { KeyMetricType } from '../../KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from '../../values/IKeyMetricValue';
import { InventoryKeyMetric } from '../../values/InventoryKeyMetric';
import { RoomCategoryStatsDO } from '../../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { IMetricBuilderInput } from "../IMetricBuilderStrategy";

import _ = require('underscore');

export class RoomCategoryBuilderStrategy extends AMetricBuilderStrategy {
    constructor(hotelInventoryStats: IHotelInventoryStats, private _roomCategoryStats: RoomCategoryStatsDO, 
        input: IMetricBuilderInput) {
        super(hotelInventoryStats, input);
    }

    protected getType(): KeyMetricType {
        return KeyMetricType.RoomCategory;
    }
    protected getValueType(): KeyMetricValueType {
        return KeyMetricValueType.Inventory;
    }
    protected getKeyMetricValueCore(statsForDateList: HotelInventoryStatsForDate[]): IKeyMetricValue {
        var metric = new InventoryKeyMetric();
        var roomCategoryId = this._roomCategoryStats.roomCategory.id;
        metric.total = 0;
        metric.available = 0;
        _.forEach(statsForDateList, (statsForDate: HotelInventoryStatsForDate) => {
            let total = statsForDate.totalInventory.getNumberOfRoomsFor(roomCategoryId);
            let occupied = statsForDate.confirmedOccupancy.getOccupancyForRoomCategoryId(roomCategoryId) + statsForDate.guaranteedOccupancyOccupyingRoomsFromInventory.getOccupancyForRoomCategoryId(roomCategoryId);
            let available = total - occupied;
            metric.total += total;
            metric.available += available;
        });
        return metric;
    }
    protected getKeyMetricName(): string {
        return this._roomCategoryStats.roomCategory.displayName;
    }
}