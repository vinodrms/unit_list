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
import { CommissionOption } from "../KeyMetricsReaderInput";
import { RevenueSegment } from "../../../../hotel-inventory-snapshots/stats-reader/data-objects/revenue/ISegmentedRevenueForDate";

import _ = require('underscore');

export enum KeyMetricOutputType {
    YieldManager,
    KeyMetricReport,
    MonthlyStatsReport,

}

export class MetricBuilderStrategyFactory {
    constructor(private _hotelInventoryStats: IHotelInventoryStats,
        private _roomCategoryStatsList: RoomCategoryStatsDO[],
        private _commissionOption: CommissionOption) {
    }

    public getMetricStrategies(outputType: KeyMetricOutputType): IMetricBuilderStrategy[] {
        var metricList: IMetricBuilderStrategy[] = [];

        if (outputType === KeyMetricOutputType.YieldManager || outputType === KeyMetricOutputType.KeyMetricReport) {
            switch (this._commissionOption) {
                case CommissionOption.INCLUDE:
                    metricList = [
                        new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new AllotmentsBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomsBuilderStrategy(this._hotelInventoryStats, {})
                    ];
                    break;
                case CommissionOption.EXCLUDE:
                    metricList = [
                        new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: RevenueSegment.All
                        }),
                        new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: RevenueSegment.All
                        }),
                        new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: RevenueSegment.All
                        }),
                        new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: RevenueSegment.All
                        }),
                        new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: RevenueSegment.All
                        }),
                        new AllotmentsBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomsBuilderStrategy(this._hotelInventoryStats, {})
                    ];
                    break;
                case CommissionOption.BOTH:
                    metricList = [
                        new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: RevenueSegment.All
                        }),
                        new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: RevenueSegment.All
                        }),
                        new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: RevenueSegment.All
                        }),
                        new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: RevenueSegment.All
                        }),
                        new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: RevenueSegment.All
                        }),
                        new AllotmentsBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomsBuilderStrategy(this._hotelInventoryStats, {})
                    ];
                    break;
                case CommissionOption.INCLUDE_AND_BOTH_FOR_ROOM_REVENUE:
                    metricList = [
                        new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: RevenueSegment.All
                        }),
                        new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: RevenueSegment.All
                        }),
                        new AllotmentsBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomsBuilderStrategy(this._hotelInventoryStats, {})
                    ];
                    break;
            }

            this._roomCategoryStatsList = _.sortBy(this._roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
                return roomCategoryStats.roomCategory.displayName;
            });

            _.forEach(this._roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
                metricList.push(
                    new RoomCategoryBuilderStrategy(this._hotelInventoryStats, roomCategoryStats, {})
                );
            });
        }

        else if(outputType === KeyMetricOutputType.MonthlyStatsReport) {
            switch (this._commissionOption) {
                case CommissionOption.INCLUDE:
                    metricList = [
                        
                    ];
                    break;
                case CommissionOption.EXCLUDE:
                    metricList = [
                        
                    ];
                    break;
                case CommissionOption.BOTH:
                    metricList = [
                        
                    ];
                    break;
                case CommissionOption.INCLUDE_AND_BOTH_FOR_ROOM_REVENUE:
                    metricList = [
                        
                    ];
                    break;
            }
        }

        return metricList;
    }
}