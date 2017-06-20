import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { BookingDOConstraints } from "../../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingSearchResultRepoDO } from "../../../../data-layer/bookings/repositories/IBookingRepository";
import { BookingDO, TravelType, TravelActivityType } from "../../../../data-layer/bookings/data-objects/BookingDO";

import _ = require('underscore');

export class MonthlyStatsReportNightsDividedByPurposeSectionGenerator extends AReportSectionGeneratorStrategy {
    private _individualBusinessGuestNights: number = 0;
    private _individualLeisureGuestNights: number = 0;
    private _groupBusinessGuestNights: number = 0;
    private _groupLeisureGuestNights: number = 0;

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _bookingList: BookingDO[]) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Guest nights divided by the purpose of the stay"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return {
            "Individual - Business guest nigths": this._individualBusinessGuestNights,
            "Individual - Leisure guest nigths": this._individualLeisureGuestNights,
            "Group - Business guest nigths": this._groupBusinessGuestNights,
            "Group - Leisure guest nigths": this._groupLeisureGuestNights,
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
        let individualBookings = _.filter(this._bookingList, (booking: BookingDO) => {
            return booking.travelType === TravelType.Individual;
        });
        let groupBookings = _.filter(this._bookingList, (booking: BookingDO) => {
            return booking.travelType === TravelType.Group;
        });

        this._individualBusinessGuestNights = 
            this.getTotalGuestNightsByTravelActivityType(individualBookings, TravelActivityType.Business);
        this._individualLeisureGuestNights = 
            this.getTotalGuestNightsByTravelActivityType(individualBookings, TravelActivityType.Leisure);
        this._groupBusinessGuestNights = 
            this.getTotalGuestNightsByTravelActivityType(groupBookings, TravelActivityType.Business);
        this._groupLeisureGuestNights = 
            this.getTotalGuestNightsByTravelActivityType(groupBookings, TravelActivityType.Leisure);

        resolve([]);
    }

    private getTotalGuestNightsByTravelActivityType(bookingList: BookingDO[], travelActivityType: TravelActivityType): number {
        return _.chain(bookingList).filter((booking: BookingDO) => {
            return booking.travelActivityType === travelActivityType;
        }).reduce((sum, booking: BookingDO) => {
            return sum + booking.getNumberOfGuestNights();
        }, 0).value();
    }
}