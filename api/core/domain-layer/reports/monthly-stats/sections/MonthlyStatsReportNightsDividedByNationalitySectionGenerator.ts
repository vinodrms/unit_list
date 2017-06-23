import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { BookingDOConstraints } from "../../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingSearchResultRepoDO } from "../../../../data-layer/bookings/repositories/IBookingRepository";
import { BookingDO, TravelType, TravelActivityType } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { CustomerSearchResultRepoDO } from "../../../../data-layer/customers/repositories/ICustomerRepository";
import { CustomerDO } from "../../../../data-layer/customers/data-objects/CustomerDO";
import { CountryDO } from "../../../../data-layer/common/data-objects/country/CountryDO";
import { MonthlyStatsReportGroupGenerator } from "../MonthlyStatsReportGroupGenerator";
import { HotelDetailsDO } from "../../../hotel-details/utils/HotelDetailsBuilder";
import { CountryContainer } from "../utils/CountryContainer";

import _ = require('underscore');

export class MonthlyStatsReportNightsDividedByNationalitySectionGenerator extends AReportSectionGeneratorStrategy {
    private _countryNameToGuestNights: { [countryName: string]: number; };

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object, private _hotelDetails: HotelDetailsDO,
        private _bookingList: BookingDO[], private _countryContainer: CountryContainer) {
        super(appContext, sessionContext, globalSummary);

        this._countryNameToGuestNights = {};
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Guest nights divided by nationality"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return this._countryNameToGuestNights;
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [

            ]
        };
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        let unsortedCountryCodeToGuestNights = {};
        _.forEach(this._bookingList, (booking: BookingDO) => {
            let noOfBookedGuests = booking.configCapacity.getTotalNumberOfGuests();
            let noOfUnknownGuests = noOfBookedGuests - booking.customerIdList.length;
            let noOfUnknownGuestNights = booking.getNumberOfNights() * noOfUnknownGuests;

            let defaultCountryCode = this.getDefaultCountryCode(booking);

            _.forEach(booking.customerIdList, (customerId: string) => {
                let countryCode = this._countryContainer.getCountryByCustomerId(customerId).code;
                if (!_.isString(countryCode)) {
                    countryCode = CountryContainer.OtherCountryCode;
                }
                console.log('countryCode: ' + countryCode);
                unsortedCountryCodeToGuestNights[countryCode] =
                    _.isNumber(unsortedCountryCodeToGuestNights[countryCode]) ?
                        unsortedCountryCodeToGuestNights[countryCode] + booking.getNumberOfNights() :
                        booking.getNumberOfNights();

            });

            unsortedCountryCodeToGuestNights[defaultCountryCode] =
                _.isNumber(unsortedCountryCodeToGuestNights[defaultCountryCode]) ?
                    unsortedCountryCodeToGuestNights[defaultCountryCode] + noOfUnknownGuestNights :
                    noOfUnknownGuestNights;

        });

        let hotelsHomeCountryCode = this._hotelDetails.hotel.contactDetails.address.country.code;

        let guestNightsFromHomeCountry = unsortedCountryCodeToGuestNights[hotelsHomeCountryCode];
        let otherGuestNights = unsortedCountryCodeToGuestNights[CountryContainer.OtherCountryCode];
        delete unsortedCountryCodeToGuestNights[hotelsHomeCountryCode];
        delete unsortedCountryCodeToGuestNights[CountryContainer.OtherCountryCode];

        let countryCodes = Object.keys(unsortedCountryCodeToGuestNights);
        countryCodes.sort();

        this._countryNameToGuestNights = {};
        
        let homeCountryName = this._countryContainer.getCountryByCountryCode(hotelsHomeCountryCode).name;
        this._countryNameToGuestNights[homeCountryName] = guestNightsFromHomeCountry;
        
        _.forEach(countryCodes, (countryCode: string) => {
            let countryName = this._countryContainer.getCountryByCountryCode(countryCode).name;
            this._countryNameToGuestNights[countryName] = unsortedCountryCodeToGuestNights[countryCode];
        });

        let otherCountryName = this._countryContainer.getCountryByCountryCode(CountryContainer.OtherCountryCode);
        this._countryNameToGuestNights[CountryContainer.OtherCountryName] = otherGuestNights;

        resolve([]);

    }

    private getDefaultCountryCode(booking: BookingDO): string {
        let defaultCountryCode = CountryContainer.OtherCountryCode;

        _.forEach(booking.customerIdList, (customerId: string) => {
            if (defaultCountryCode != CountryContainer.OtherCountryCode) {
                return;
            }

            let country = this._countryContainer.getCountryByCustomerId(customerId);
            if (_.isUndefined(country) || !_.isString(country.code)) {
                return;
            }

            defaultCountryCode = country.code;
        });

        return defaultCountryCode;
    }
}