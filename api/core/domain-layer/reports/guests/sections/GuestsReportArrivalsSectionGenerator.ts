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

export class GuestsReportArrivalsSectionGenerator extends AReportSectionGeneratorStrategy {
    private _totalBookings: number = 0;
    private _totalAdults: number = 0;
    private _totalChildren: number = 0;
    private _totalBabies: number = 0;
    private _totalBabyBeds: number = 0;
    
    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _date: ThDateDO) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: this._date.toString() + " - " + "Arrivals"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return {
            "Total bookings": this._totalBookings,
            "Adults": this._totalAdults,
            "Children": this._totalChildren,
            "Babies": this._totalBabies,
            "Baby beds": this._totalBabyBeds,
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
        let query = {
            confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CountedInInventory,

        }
        
        var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
            confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CountedInInventory,
            startDateEq: this._date
        }).then((result: BookingSearchResultRepoDO) => {
            this._totalBookings = result.bookingList.length;
            this._totalAdults = _.reduce(result.bookingList, function(sum, booking: BookingDO){ return sum + booking.configCapacity.noAdults; }, 0);
            this._totalChildren = _.reduce(result.bookingList, function(sum, booking: BookingDO){ return sum + booking.configCapacity.noChildren; }, 0);
            this._totalBabies = _.reduce(result.bookingList, function(sum, booking: BookingDO){ return sum + booking.configCapacity.noBabies; }, 0);
            this._totalBabyBeds = _.reduce(result.bookingList, function(sum, booking: BookingDO){ return sum + booking.configCapacity.noBabyBeds; }, 0);

            resolve([]);
        }).catch((e) => {
			reject(e);
		});
    }
}