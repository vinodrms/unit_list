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
import { CountryDO } from "../../../../../data-layer/common/data-objects/country/CountryDO";
import { GuestNightsBuilderStrategy } from "./strategies/GuestNightsBuilderStrategy";
import { GuestNightsWeekdaysBuilderStrategy } from "./strategies/GuestNightsWeekdaysBuilderStrategy";
import { GuestNightsWeekendBuilderStrategy } from "./strategies/GuestNightsWeekendBuilderStrategy";
import { GuestNightsByNationalityBuilderStrategy } from "./strategies/GuestNightsByNationalityBuilderStrategy";
import { BookingSegment } from "../../../../hotel-inventory-snapshots/stats-reader/data-objects/utils/BookingSegment";
import { GuestNightsByBookingSegmentBuilderStrategy } from "./strategies/GuestNightsByBookingSegmentBuilderStrategy";
import { CountryContainer } from "../../../../reports/monthly-stats/utils/CountryContainer";
import { ArrivalsBuilderStrategy } from "./strategies/ArrivalsBuilderStrategy";
import { ArrivalsByNationalityBuilderStrategy } from "./strategies/ArrivalsByNationalityBuilderStrategy";
import { RoomNightsByBookingSegmentBuilderStrategy } from "./strategies/RoomNightsByBookingSegmentBuilderStrategy";
import { RoomNightsBuilderStrategy } from "./strategies/RoomNightsBuilderStrategy";
import { BreakfastRevenueBuilderStrategy } from "./strategies/BreakfastRevenueBuilderStrategy";

import _ = require('underscore');

export enum KeyMetricOutputType {
    YieldManager,
    KeyMetricReport,
    MonthlyStatsReport,

}

export class MetricBuilderStrategyFactory {
    constructor(private _hotelInventoryStats: IHotelInventoryStats,
        private _countryList: CountryDO[],
        private _commissionOption: CommissionOption) {
    }

    public getMetricStrategies(outputType: KeyMetricOutputType): IMetricBuilderStrategy[] {
        var metricList: IMetricBuilderStrategy[] = [];

        if (outputType === KeyMetricOutputType.YieldManager || outputType === KeyMetricOutputType.KeyMetricReport) {
            metricList = [
                new GuestNightsBuilderStrategy(this._hotelInventoryStats, {}),
                new GuestNightsWeekdaysBuilderStrategy(this._hotelInventoryStats, {}),
                new GuestNightsWeekendBuilderStrategy(this._hotelInventoryStats, {})
            ]

            _.forEach(this._countryList, (country: CountryDO) => {
                metricList.push(new GuestNightsByNationalityBuilderStrategy(this._hotelInventoryStats, country, {}));
            });

            // switch (this._commissionOption) {
            //     case CommissionOption.INCLUDE:
            //         metricList = [
            //             new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
            //             new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
            //             new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new AllotmentsBuilderStrategy(this._hotelInventoryStats, {}),
            //             new RoomsBuilderStrategy(this._hotelInventoryStats, {})
            //         ];
            //         break;
            //     case CommissionOption.EXCLUDE:
            //         metricList = [
            //             new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: true,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: true,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
            //             new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
            //             new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: true,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: true,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: true,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new AllotmentsBuilderStrategy(this._hotelInventoryStats, {}),
            //             new RoomsBuilderStrategy(this._hotelInventoryStats, {})
            //         ];
            //         break;
            //     case CommissionOption.BOTH:
            //         metricList = [
            //             new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: true,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: true,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
            //             new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
            //             new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: true,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: true,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: true,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new AllotmentsBuilderStrategy(this._hotelInventoryStats, {}),
            //             new RoomsBuilderStrategy(this._hotelInventoryStats, {})
            //         ];
            //         break;
            //     case CommissionOption.INCLUDE_AND_BOTH_FOR_ROOM_REVENUE:
            //         metricList = [
            //             new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
            //             new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
            //             new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: true,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
            //                 excludeCommission: false,
            //                 revenueSegment: RevenueSegment.All
            //             }),
            //             new AllotmentsBuilderStrategy(this._hotelInventoryStats, {}),
            //             new RoomsBuilderStrategy(this._hotelInventoryStats, {})
            //         ];
            //         break;
        }

        // this._roomCategoryStatsList = _.sortBy(this._roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
        //     return roomCategoryStats.roomCategory.displayName;
        // });

        // _.forEach(this._roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
        //     metricList.push(
        //         new RoomCategoryBuilderStrategy(this._hotelInventoryStats, roomCategoryStats, {})
        //     );
        // });
        // }

        else if (outputType === KeyMetricOutputType.MonthlyStatsReport) {
            metricList = [
                new GuestNightsBuilderStrategy(this._hotelInventoryStats, {}),
                new GuestNightsWeekdaysBuilderStrategy(this._hotelInventoryStats, {}),
                new GuestNightsWeekendBuilderStrategy(this._hotelInventoryStats, {}),
                new ArrivalsBuilderStrategy(this._hotelInventoryStats, {}),
                new RoomNightsBuilderStrategy(this._hotelInventoryStats, {}),
                new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                    excludeCommission: true,
                    revenueSegment: BookingSegment.All
                }),
                new BreakfastRevenueBuilderStrategy(this._hotelInventoryStats, {
                    excludeCommission: true,
                    revenueSegment: BookingSegment.All
                })
            ]

            let bookingSegments = [BookingSegment.BusinessGroup, BookingSegment.BusinessIndividual,
            BookingSegment.LeisureGroup, BookingSegment.LeisureIndividual]

            _.forEach(bookingSegments, (bookingSegment: BookingSegment) => {
                metricList.push(new GuestNightsByBookingSegmentBuilderStrategy(this._hotelInventoryStats, bookingSegment,
                    {}));
                metricList.push(new RoomNightsByBookingSegmentBuilderStrategy(this._hotelInventoryStats, bookingSegment,
                    {}));
                metricList.push(
                    new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                        excludeCommission: true,
                        revenueSegment: bookingSegment
                    })
                );
            });

            this._countryList.push(CountryContainer.buildOtherCountryDO());
            _.forEach(this._countryList, (country: CountryDO) => {
                metricList.push(new GuestNightsByNationalityBuilderStrategy(this._hotelInventoryStats, country, {}));
                metricList.push(new ArrivalsByNationalityBuilderStrategy(this._hotelInventoryStats, country, {}));
            });

        }

        return metricList;
    }
}