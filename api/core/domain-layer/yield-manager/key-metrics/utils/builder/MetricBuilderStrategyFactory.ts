import { IHotelInventoryStats } from '../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import { RoomCategoryStatsDO } from '../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { TotalOccupancyBuilderStrategy } from './strategies/TotalOccupancyBuilderStrategy';
import { ConfirmedOccupancyBuilderStrategy } from './strategies/ConfirmedOccupancyBuilderStrategy';
import { TotalRevParBuilderStrategy } from './strategies/TotalRevParBuilderStrategy';
import { TotalAvgRateBuilderStrategy } from './strategies/TotalAvgRateBuilderStrategy';
import { RoomsBuilderStrategy } from './strategies/RoomsBuilderStrategy';
import { AllotmentsBuilderStrategy } from './strategies/AllotmentsBuilderStrategy';
import { RoomRevenueBuilderStrategy } from './strategies/RoomRevenueBuilderStrategy';
import { OtherRevenueBuilderStrategy } from './strategies/OtherRevenueBuilderStrategy';
import { RoomCategoryBuilderStrategy } from './strategies/RoomCategoryBuilderStrategy';
import { ConfirmedRevenueBuilderStrategy } from './strategies/ConfirmedRevenueBuilderStrategy';
import { IMetricBuilderStrategy } from './IMetricBuilderStrategy';

import _ = require('underscore');

export class MetricBuilderStrategyFactory {
    constructor(private _hotelInventoryStats: IHotelInventoryStats,
        private _roomCategoryStatsList: RoomCategoryStatsDO[]) {
    }

    public getMetricStrategies(): IMetricBuilderStrategy[] {
        var metricList: IMetricBuilderStrategy[] = [
            new TotalRevParBuilderStrategy(this._hotelInventoryStats),
            new TotalOccupancyBuilderStrategy(this._hotelInventoryStats),
            new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats),
            new TotalAvgRateBuilderStrategy(this._hotelInventoryStats),
            new RoomRevenueBuilderStrategy(this._hotelInventoryStats),
            new OtherRevenueBuilderStrategy(this._hotelInventoryStats),
            new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats),
            new AllotmentsBuilderStrategy(this._hotelInventoryStats),
            new RoomsBuilderStrategy(this._hotelInventoryStats)
        ];
        _.forEach(this._roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
            metricList.push(new RoomCategoryBuilderStrategy(this._hotelInventoryStats, roomCategoryStats));
        });
        return metricList;
    }
}