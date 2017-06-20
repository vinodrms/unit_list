import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { BookingDOConstraints } from "../../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingSearchResultRepoDO } from "../../../../data-layer/bookings/repositories/IBookingRepository";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";

import _ = require('underscore');

export class MonthlyStatsReportNoOfNightsSectionGenerator extends AReportSectionGeneratorStrategy {
    private _totalGuestNights: number = 0;

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _bookingList: BookingDO[]) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Total guest nights"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return {
            "Total guest nigths": this._totalGuestNights,

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
        this._totalGuestNights = _.reduce(this._bookingList, (sum, booking: BookingDO) => {
            return sum + booking.getNumberOfGuestNights();
        }, 0);

        resolve([]);
    }
}