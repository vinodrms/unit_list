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
import { CommissionOption } from "../KeyMetricsReaderInput";

export class MetricBuilderStrategyFactory {
    constructor(private _hotelInventoryStats: IHotelInventoryStats,
        private _roomCategoryStatsList: RoomCategoryStatsDO[],
        private _commissionOption: CommissionOption) {
    }

    public getMetricStrategies(): IMetricBuilderStrategy[] {
        var metricList: IMetricBuilderStrategy[] = [];
        switch (this._commissionOption) {
            case CommissionOption.INCLUDE:
                metricList = [
                    new TotalRevParBuilderStrategy(this._hotelInventoryStats, false),
                    new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, false),
                    new TotalOccupancyBuilderStrategy(this._hotelInventoryStats),
                    new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats),
                    new RoomRevenueBuilderStrategy(this._hotelInventoryStats, false),
                    new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, false),
                    new OtherRevenueBuilderStrategy(this._hotelInventoryStats, false),
                    new AllotmentsBuilderStrategy(this._hotelInventoryStats),
                    new RoomsBuilderStrategy(this._hotelInventoryStats)
                ];
                break;
            case CommissionOption.EXCLUDE:
                metricList = [
                    new TotalRevParBuilderStrategy(this._hotelInventoryStats, true),
                    new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, true),
                    new TotalOccupancyBuilderStrategy(this._hotelInventoryStats),
                    new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats),
                    new RoomRevenueBuilderStrategy(this._hotelInventoryStats, true),
                    new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, true),
                    new OtherRevenueBuilderStrategy(this._hotelInventoryStats, true),
                    new AllotmentsBuilderStrategy(this._hotelInventoryStats),
                    new RoomsBuilderStrategy(this._hotelInventoryStats)
                ];
                break;
            case CommissionOption.BOTH:
                metricList = [
                    new TotalRevParBuilderStrategy(this._hotelInventoryStats, false),
                    new TotalRevParBuilderStrategy(this._hotelInventoryStats, true),
                    new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, false),
                    new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, true),
                    new TotalOccupancyBuilderStrategy(this._hotelInventoryStats),
                    new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats),
                    new RoomRevenueBuilderStrategy(this._hotelInventoryStats, false),
                    new RoomRevenueBuilderStrategy(this._hotelInventoryStats, true),
                    new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, false),
                    new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, true),
                    new OtherRevenueBuilderStrategy(this._hotelInventoryStats, false),
                    new OtherRevenueBuilderStrategy(this._hotelInventoryStats, true),
                    new AllotmentsBuilderStrategy(this._hotelInventoryStats),
                    new RoomsBuilderStrategy(this._hotelInventoryStats)
                ];
                break;   
            case CommissionOption.INCLUDE_AND_BOTH_FOR_ROOM_REVENUE:
                metricList = [
                    new TotalRevParBuilderStrategy(this._hotelInventoryStats, false),
                    new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, false),
                    new TotalOccupancyBuilderStrategy(this._hotelInventoryStats),
                    new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats),
                    new RoomRevenueBuilderStrategy(this._hotelInventoryStats, false),
                    new RoomRevenueBuilderStrategy(this._hotelInventoryStats, true),
                    new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, false),
                    new OtherRevenueBuilderStrategy(this._hotelInventoryStats, false),
                    new AllotmentsBuilderStrategy(this._hotelInventoryStats),
                    new RoomsBuilderStrategy(this._hotelInventoryStats)
                ];
                break;
        }
        this._roomCategoryStatsList = _.sortBy(this._roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
             return roomCategoryStats.roomCategory.displayName; 
        });

        _.forEach(this._roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
            metricList.push(new RoomCategoryBuilderStrategy(this._hotelInventoryStats, roomCategoryStats));
        });
        return metricList;
    }
}