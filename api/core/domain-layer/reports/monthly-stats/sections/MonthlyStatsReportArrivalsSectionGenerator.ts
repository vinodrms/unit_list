import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { BookingDOConstraints } from "../../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingSearchResultRepoDO } from "../../../../data-layer/bookings/repositories/IBookingRepository";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { HotelDetailsDO } from "../../../hotel-details/utils/HotelDetailsBuilder";

import _ = require('underscore');

export class MonthlyStatsReportArrivalsSectionGenerator extends AReportSectionGeneratorStrategy {
    private _localSummary: Object;

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _hotelDetails: HotelDetailsDO, private _bookingList: BookingDO[], 
        private _customerIdToCountryMap: { [index: string]: string; }) {
        super(appContext, sessionContext, globalSummary);

        this._localSummary = {};
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Arrivals"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return this._localSummary;
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [

            ]
        };
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        this._localSummary["Total number of arrivals"] = 
            this.getTotalNumberOfArrivalsFromBookingList(this._bookingList);

        let totalNoOfArrivalsFromHotelsHomeCountryLabel = 
            this._appContext.thTranslate.translate("Out of which from") + " " 
                + this._hotelDetails.hotel.contactDetails.address.country.name;

        let danishBookings = _.filter(this._bookingList, (booking: BookingDO) => {
            let firstCustomerId = booking.customerIdList[0];
            let countryName = this._customerIdToCountryMap[firstCustomerId];

            return countryName === "Denmark";
        });

        this._localSummary[totalNoOfArrivalsFromHotelsHomeCountryLabel] = 
            this.getTotalNumberOfArrivalsFromBookingList(danishBookings);

        resolve([]);
    }

    private getTotalNumberOfArrivalsFromBookingList(bookingList: BookingDO[]): number {
        return _.reduce(bookingList, (sum, booking: BookingDO) => { 
            return sum + booking.configCapacity.getTotalNumberOfGuests(); 
        }, 0);
    }
}