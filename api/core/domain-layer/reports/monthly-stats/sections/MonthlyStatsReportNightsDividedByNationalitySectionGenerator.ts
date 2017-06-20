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

import _ = require('underscore');

export class MonthlyStatsReportNightsDividedByNationalitySectionGenerator extends AReportSectionGeneratorStrategy {
    private _countryNameToGuestNights: { [countryName: string]: number; };

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _bookingList: BookingDO[], private _customerIdToCountryMap: { [index: string]: string; }) {
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
        let unsortedCountryNameToGuestNights = {};
        _.forEach(this._bookingList, (booking: BookingDO) => {
            let noOfBookedGuests = booking.configCapacity.getTotalNumberOfGuests();
            let noOfUnknownGuests = noOfBookedGuests - booking.customerIdList.length;
            let noOfUnknownGuestNights = booking.getNumberOfNights() * noOfUnknownGuests;

            let defaultCountryName = this.getDefaultCountryName(booking);

            _.forEach(booking.customerIdList, (cusotmerId: string) => {
                let countryName = this._customerIdToCountryMap[cusotmerId];
                if (!_.isString(countryName)) {
                    countryName = "Other";
                }

                unsortedCountryNameToGuestNights[countryName] =
                    _.isNumber(unsortedCountryNameToGuestNights[countryName]) ?
                        unsortedCountryNameToGuestNights[countryName] + booking.getNumberOfNights() :
                        booking.getNumberOfNights();

            });

            unsortedCountryNameToGuestNights[defaultCountryName] =
                _.isNumber(unsortedCountryNameToGuestNights[defaultCountryName]) ?
                    unsortedCountryNameToGuestNights[defaultCountryName] + noOfUnknownGuestNights :
                    noOfUnknownGuestNights;

        });

        let dkGuestNights = unsortedCountryNameToGuestNights['Denmark'];
        let otherGuestNights = unsortedCountryNameToGuestNights['Other'];
        delete unsortedCountryNameToGuestNights['Denmark'];
        delete unsortedCountryNameToGuestNights['Other'];

        let countryNames = Object.keys(unsortedCountryNameToGuestNights);
        countryNames.sort();

        this._countryNameToGuestNights = {};
        this._countryNameToGuestNights['Denmark'] = dkGuestNights;
        _.forEach(countryNames, (countryName: string) => {
            this._countryNameToGuestNights[countryName] = unsortedCountryNameToGuestNights[countryName];
        });
        this._countryNameToGuestNights['Other'] = otherGuestNights;

        let counter = 0;
        let keys = Object.keys(this._countryNameToGuestNights);
        _.forEach(keys, (key: string) => {
            counter += this._countryNameToGuestNights[key];
        });
        debugger
        resolve([]);

    }

    private getDefaultCountryName(booking: BookingDO): string {
        let defaultCountryName = 'Other';

        _.forEach(booking.customerIdList, (cusotmerId: string) => {
            if (defaultCountryName != 'Other') {
                return;
            }

            let countryName = this._customerIdToCountryMap[cusotmerId];
            if (!_.isString(countryName)) {
                return;
            }

            defaultCountryName = countryName;
        });

        return defaultCountryName;
    }
}