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

import _ = require('underscore');

export class MonthlyStatsReportNightsDividedByNationalitySectionGenerator extends AReportSectionGeneratorStrategy {
    private _countryNameToGuestNights: { [countryName: string]: number; };

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object, private _hotelDetails: HotelDetailsDO,
        private _bookingList: BookingDO[], private _customerIdToCountryMap: { [index: string]: CountryDO; }, 
        private _countryCodeToCountryMap: { [index: string]: CountryDO; }) {
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
        debugger
        let unsortedCountryNameToGuestNights = {};
        _.forEach(this._bookingList, (booking: BookingDO) => {
            let noOfBookedGuests = booking.configCapacity.getTotalNumberOfGuests();
            let noOfUnknownGuests = noOfBookedGuests - booking.customerIdList.length;
            let noOfUnknownGuestNights = booking.getNumberOfNights() * noOfUnknownGuests;

            let defaultCountryCode = this.getDefaultCountryCode(booking);

            _.forEach(booking.customerIdList, (customerId: string) => {
                if(_.isUndefined(this._customerIdToCountryMap[customerId])) {
                    debugger
                }
                let countryCode = this._customerIdToCountryMap[customerId].code;
                if (!_.isString(countryCode)) {
                    countryCode = MonthlyStatsReportGroupGenerator.OtherCountryCode;
                }

                unsortedCountryNameToGuestNights[countryCode] =
                    _.isNumber(unsortedCountryNameToGuestNights[countryCode]) ?
                        unsortedCountryNameToGuestNights[countryCode] + booking.getNumberOfNights() :
                        booking.getNumberOfNights();

            });

            unsortedCountryNameToGuestNights[defaultCountryCode] =
                _.isNumber(unsortedCountryNameToGuestNights[defaultCountryCode]) ?
                    unsortedCountryNameToGuestNights[defaultCountryCode] + noOfUnknownGuestNights :
                    noOfUnknownGuestNights;

        });

        let hotelsHomeCountryCode = this._hotelDetails.hotel.contactDetails.address.country.code;

        let guestNightsFromHomeCountry = unsortedCountryNameToGuestNights[hotelsHomeCountryCode];
        let otherGuestNights = unsortedCountryNameToGuestNights[MonthlyStatsReportGroupGenerator.OtherCountryCode];
        delete unsortedCountryNameToGuestNights[hotelsHomeCountryCode];
        delete unsortedCountryNameToGuestNights[MonthlyStatsReportGroupGenerator.OtherCountryCode];

        let countryCodes = Object.keys(unsortedCountryNameToGuestNights);
        countryCodes.sort();

        this._countryNameToGuestNights = {};
        
        let homeCountryName = this._countryCodeToCountryMap[hotelsHomeCountryCode].name;
        this._countryNameToGuestNights[homeCountryName] = guestNightsFromHomeCountry;
        
        _.forEach(countryCodes, (countryCode: string) => {
            let countryName = this._countryCodeToCountryMap[countryCode].name;
            this._countryNameToGuestNights[countryName] = unsortedCountryNameToGuestNights[countryName];
        });

        let otherCountryName = this._countryCodeToCountryMap[MonthlyStatsReportGroupGenerator.OtherCountryCode];
        this._countryNameToGuestNights[MonthlyStatsReportGroupGenerator.OtherCountryCode] = otherGuestNights;

        resolve([]);

    }

    private getDefaultCountryCode(booking: BookingDO): string {
        let defaultCountryCode = MonthlyStatsReportGroupGenerator.OtherCountryCode;

        _.forEach(booking.customerIdList, (customerId: string) => {
            if (defaultCountryCode != MonthlyStatsReportGroupGenerator.OtherCountryCode) {
                return;
            }

            let country = this._customerIdToCountryMap[customerId];
            if (_.isUndefined(country) || !_.isString(country.code)) {
                return;
            }

            defaultCountryCode = country.code;
        });

        return defaultCountryCode;
    }
}