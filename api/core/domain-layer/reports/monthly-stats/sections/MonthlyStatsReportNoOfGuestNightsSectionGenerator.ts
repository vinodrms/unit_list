import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { BookingDOConstraints } from "../../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingSearchResultRepoDO } from "../../../../data-layer/bookings/repositories/IBookingRepository";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { IndexedBookingInterval } from "../../../../data-layer/price-products/utils/IndexedBookingInterval";
import { ISOWeekDay } from "../../../../utils/th-dates/data-objects/ISOWeekDay";

import _ = require('underscore');

export class MonthlyStatsReportNoOfGuestNightsSectionGenerator extends AReportSectionGeneratorStrategy {
    private _totalGuestNights: number = 0;
    private _weekdaysGuestNights: number = 0;
    private _weekendGuestNights: number = 0;

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _bookingList: BookingDO[]) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Guest nights"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return {
            "Total guest nigths": this._totalGuestNights,
            "Total guest nights weekdays": this._weekdaysGuestNights,
            "Total guest nights weekend": this._weekendGuestNights,

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

        _.forEach(this._bookingList, (booking: BookingDO) => {
            let indexedInterval = new IndexedBookingInterval(booking.interval);
            
            let weekendDays = [ISOWeekDay.Saturday, ISOWeekDay.Sunday];
            let noOfWeekendNights = 0;
            _.forEach(indexedInterval.bookingISOWeekDayList, (day: ISOWeekDay) => {
                if(_.contains(weekendDays, day)) {
                    noOfWeekendNights++;
                }
            });

            let noOfWeekNights = booking.getNumberOfNights() - noOfWeekendNights;

            this._weekdaysGuestNights += booking.configCapacity.getTotalNumberOfGuests() * noOfWeekNights;
            this._weekendGuestNights += booking.configCapacity.getTotalNumberOfGuests() * noOfWeekendNights;
        });

        resolve([]);
    }
}