import {IHotelInventoryStats} from '../../../../hotel-inventory-snapshots/stats-reader/data-objects/IHotelInventoryStats';
import {TotalOccupancyBuilderStrategy} from './strategies/TotalOccupancyBuilderStrategy';
import {ConfirmedOccupancyBuilderStrategy} from './strategies/ConfirmedOccupancyBuilderStrategy';
import {TotalRevParBuilderStrategy} from './strategies/TotalRevParBuilderStrategy';
import {ConfirmedRevParBuilderStrategy} from './strategies/ConfirmedRevParBuilderStrategy';
import {TotalAvgRateBuilderStrategy} from './strategies/TotalAvgRateBuilderStrategy';
import {ConfirmedAvgRateBuilderStrategy} from './strategies/ConfirmedAvgRateBuilderStrategy';
import {RoomsBuilderStrategy} from './strategies/RoomsBuilderStrategy';
import {AllotmentsBuilderStrategy} from './strategies/AllotmentsBuilderStrategy';
import {RoomRevenueBuilderStrategy} from './strategies/RoomRevenueBuilderStrategy';
import {OtherRevenueBuilderStrategy} from './strategies/OtherRevenueBuilderStrategy';
import {IMetricBuilderStrategy} from './IMetricBuilderStrategy';

export class MetricBuilderStrategyFactory {
    constructor(private _hotelInventoryStats: IHotelInventoryStats) {
    }

    public getMetricStrategies(): IMetricBuilderStrategy[] {
        return [
            new TotalOccupancyBuilderStrategy(this._hotelInventoryStats),
            new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats),
            new TotalRevParBuilderStrategy(this._hotelInventoryStats),
            new ConfirmedRevParBuilderStrategy(this._hotelInventoryStats),
            new TotalAvgRateBuilderStrategy(this._hotelInventoryStats),
            new ConfirmedAvgRateBuilderStrategy(this._hotelInventoryStats),
            new RoomsBuilderStrategy(this._hotelInventoryStats),
            new AllotmentsBuilderStrategy(this._hotelInventoryStats),
            new RoomRevenueBuilderStrategy(this._hotelInventoryStats),
            new OtherRevenueBuilderStrategy(this._hotelInventoryStats)
        ];
    }
}