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
import { CountryContainer } from "../../../../reports/general-stats/utils/CountryContainer";
import { ArrivalsBuilderStrategy } from "./strategies/ArrivalsBuilderStrategy";
import { ArrivalsByNationalityBuilderStrategy } from "./strategies/ArrivalsByNationalityBuilderStrategy";
import { RoomNightsByBookingSegmentBuilderStrategy } from "./strategies/RoomNightsByBookingSegmentBuilderStrategy";
import { RoomNightsBuilderStrategy } from "./strategies/RoomNightsBuilderStrategy";
import { BreakfastInternalCostByBookingSegmentBuilderStrategy } from "./strategies/BreakfastInternalCostByBookingSegmentBuilderStrategy";
import { BreakfastRevenueByBookingSegmentBuilderStrategy } from "./strategies/BreakfastRevenueByBookingSegmentBuilderStrategy";

import _ = require('underscore');

export enum KeyMetricOutputType {
    YieldManager,
    KeyMetricReport,
    GeneralStatsReport,

}

export class MetricBuilderStrategyFactory {
    constructor(private _hotelInventoryStats: IHotelInventoryStats,
        private _countryList: CountryDO[],
        private _commissionOption: CommissionOption,
        private _roomCategoryStatsList: RoomCategoryStatsDO[]) {
    }

    public getMetricStrategies(outputType: KeyMetricOutputType): IMetricBuilderStrategy[] {
        var metricList: IMetricBuilderStrategy[] = [];

        if (outputType === KeyMetricOutputType.YieldManager || outputType === KeyMetricOutputType.KeyMetricReport) {
            switch (this._commissionOption) {
                case CommissionOption.INCLUDE:
                    metricList = [
                        new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new AllotmentsBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomsBuilderStrategy(this._hotelInventoryStats, {})
                    ];
                    break;
                case CommissionOption.EXCLUDE:
                    metricList = [
                        new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: BookingSegment.All
                        }),
                        new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: BookingSegment.All
                        }),
                        new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: BookingSegment.All
                        }),
                        new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: BookingSegment.All
                        }),
                        new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: BookingSegment.All
                        }),
                        new AllotmentsBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomsBuilderStrategy(this._hotelInventoryStats, {})
                    ];
                    break;
                case CommissionOption.BOTH:
                    metricList = [
                        new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: BookingSegment.All
                        }),
                        new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: BookingSegment.All
                        }),
                        new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: BookingSegment.All
                        }),
                        new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: BookingSegment.All
                        }),
                        new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: BookingSegment.All
                        }),
                        new AllotmentsBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomsBuilderStrategy(this._hotelInventoryStats, {})
                    ];
                    break;
                case CommissionOption.INCLUDE_AND_BOTH_FOR_ROOM_REVENUE:
                    metricList = [
                        new TotalRevParBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new TotalOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new ConfirmedOccupancyBuilderStrategy(this._hotelInventoryStats, {}),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new RoomRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: true,
                            revenueSegment: BookingSegment.All
                        }),
                        new ConfirmedRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
                        }),
                        new OtherRevenueBuilderStrategy(this._hotelInventoryStats, {
                            excludeCommission: false,
                            revenueSegment: BookingSegment.All
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

        else if (outputType === KeyMetricOutputType.GeneralStatsReport) {
            metricList = [
                new GuestNightsBuilderStrategy(this._hotelInventoryStats, {}),
                new GuestNightsWeekdaysBuilderStrategy(this._hotelInventoryStats, {}),
                new GuestNightsWeekendBuilderStrategy(this._hotelInventoryStats, {}),
                new ArrivalsBuilderStrategy(this._hotelInventoryStats, {}),
                new RoomNightsBuilderStrategy(this._hotelInventoryStats, {}),
                new TotalAvgRateBuilderStrategy(this._hotelInventoryStats, {
                    excludeCommission: false,
                    revenueSegment: BookingSegment.All
                }),
                new BreakfastRevenueByBookingSegmentBuilderStrategy(this._hotelInventoryStats, {
                    excludeCommission: false,
                    revenueSegment: BookingSegment.All
                }),
                new BreakfastInternalCostByBookingSegmentBuilderStrategy(this._hotelInventoryStats, {
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
                        excludeCommission: false,
                        revenueSegment: bookingSegment
                    })
                );
                metricList.push(
                    new BreakfastRevenueByBookingSegmentBuilderStrategy(this._hotelInventoryStats, {
                        excludeCommission: false,
                        revenueSegment: bookingSegment
                    }) 
                );
                metricList.push(
                    new BreakfastInternalCostByBookingSegmentBuilderStrategy(this._hotelInventoryStats, {
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