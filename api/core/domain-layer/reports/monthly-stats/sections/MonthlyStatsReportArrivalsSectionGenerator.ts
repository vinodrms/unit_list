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
import { CountryDO } from "../../../../data-layer/common/data-objects/country/CountryDO";
import { CountryContainer } from "../utils/CountryContainer";

import _ = require('underscore');

export class MonthlyStatsReportArrivalsSectionGenerator extends AReportSectionGeneratorStrategy {
    private _localSummary: Object;

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _hotelDetails: HotelDetailsDO, private _bookingList: BookingDO[], 
        private _countryContainer: CountryContainer) {
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

        let hotelsHomeCountry = this._hotelDetails.hotel.contactDetails.address.country;
        let totalNoOfArrivalsFromHotelsHomeCountryLabel = 
            this._appContext.thTranslate.translate("Out of which from") + " " 
                + hotelsHomeCountry.name;

        let localCountryBookings = _.filter(this._bookingList, (booking: BookingDO) => {
            let firstCustomerId = booking.customerIdList[0];
            let country = this._countryContainer.getCountryByCustomerId(firstCustomerId);

            return country.code === hotelsHomeCountry.code;
        });

        this._localSummary[totalNoOfArrivalsFromHotelsHomeCountryLabel] = 
            this.getTotalNumberOfArrivalsFromBookingList(localCountryBookings);

        resolve([]);
    }

    private getTotalNumberOfArrivalsFromBookingList(bookingList: BookingDO[]): number {
        return _.reduce(bookingList, (sum, booking: BookingDO) => { 
            return sum + booking.configCapacity.getTotalNumberOfGuests(); 
        }, 0);
    }
}