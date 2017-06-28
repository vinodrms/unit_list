import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { BookingDOConstraints } from "../../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingSearchResultRepoDO } from "../../../../data-layer/bookings/repositories/IBookingRepository";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { RoomDO } from "../../../../data-layer/rooms/data-objects/RoomDO";
import { RoomCategoryStatsDO } from "../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";
import { BedStatsDO } from "../../../../data-layer/room-categories/data-objects/bed-stats/BedStatsDO";
import { BedStorageType } from "../../../../data-layer/common/data-objects/bed/BedDO";
import { KeyMetricsResultItem } from "../../../yield-manager/key-metrics/utils/KeyMetricsResult";
import { ThPeriodType } from "../../key-metrics/period-converter/ThPeriodDO";

import _ = require('underscore');

export class CapacitySectionGenerator extends AReportSectionGeneratorStrategy {
    private _numberOfFixedBeds: number = 0;
    private _numberOfRooms: number = 0;

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _periodType: ThPeriodType, private _kmResultItem: KeyMetricsResultItem,
        private _roomList: RoomDO[], private _roomCategoryStatsList: RoomCategoryStatsDO[]) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Capacity"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return {
            "Number of fixed beds": this._numberOfFixedBeds,
            "Number of rooms": this._numberOfRooms,

        }
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [

            ]
        };
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        this._numberOfRooms = this._roomList.length;

        let indexedStats = this.indexRoomCategoryStatsById();
        _.forEach(this._roomList, (room: RoomDO) => {
            let stats = indexedStats[room.categoryId];

            this._numberOfFixedBeds += _.filter(stats.bedStatsList, (bedStats: BedStatsDO) => {
                return bedStats.storageType == BedStorageType.Stationary;
            }).length;
        });

        resolve([]);
    }

    private indexRoomCategoryStatsById(): { [index: string]: RoomCategoryStatsDO; } {
        let map = {};

        _.forEach(this._roomCategoryStatsList, (stats: RoomCategoryStatsDO) => {
            map[stats.roomCategory.id] = stats;
        });

        return map;
    }
}