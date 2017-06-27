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

export class RoomNightsSectionGenerator extends AReportSectionGeneratorStrategy {
    private _totalRoomNights: number = 0;

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _bookingList: BookingDO[]) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Total room nights"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return {
            "Total room nigths": this._totalRoomNights,

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
        this._totalRoomNights = _.reduce(this._bookingList, (sum, booking: BookingDO) => { 
            return sum + booking.getNumberOfNights(); 
        }, 0);

        resolve([]);
    }
}