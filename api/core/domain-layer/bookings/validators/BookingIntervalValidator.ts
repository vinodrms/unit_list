import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {BookingUtils} from '../../../domain-layer/bookings/utils/BookingUtils';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateUtils} from '../../../utils/th-dates/ThDateUtils';
import {BookingDOConstraints} from '../../../data-layer/bookings/data-objects/BookingDOConstraints';

import _ = require('underscore');

export class BookingIntervalValidator {
    private _minimumBookableDate: ThDateDO;

    constructor(hotelDO: HotelDO) {
        this._minimumBookableDate = this.getMinimumBookableDate(hotelDO);
    }
    private getMinimumBookableDate(hotelDO: HotelDO): ThDateDO {
        var bookingUtils = new BookingUtils();
        var todayDate = bookingUtils.getCurrentThDateForHotel(hotelDO);
        var thDateUtils = new ThDateUtils();
        var yesterdayDate = thDateUtils.addDaysToThDateDO(todayDate, -1);
        return yesterdayDate;
    }

    public validateBookingIntervalList(param: { bookingIntervalList: ThDateIntervalDO[], isNewBooking: boolean }): Promise<ThDateIntervalDO[]> {
        var promiseList: Promise<ThDateIntervalDO>[] = [];
        _.forEach(param.bookingIntervalList, (bookingInterval: ThDateIntervalDO) => {
            promiseList.push(this.validateBookingInterval({ bookingInterval: bookingInterval, isNewBooking: param.isNewBooking }));
        });
        return Promise.all(promiseList);
    }

    public validateBookingInterval(param: { bookingInterval: ThDateIntervalDO, isNewBooking: boolean }): Promise<ThDateIntervalDO> {
        return new Promise<ThDateIntervalDO>((resolve: { (result: ThDateIntervalDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.validateBookingIntervalCore(resolve, reject, param.bookingInterval, param.isNewBooking);
            } catch (error) {
                var thError = new ThError(ThStatusCode.BookingIntervalValidatorError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error validating booking interval", param, thError);
                reject(thError);
            }
        });
    }

    private validateBookingIntervalCore(resolve: { (result: ThDateIntervalDO): void }, reject: { (err: ThError): void }, bookingInterval: ThDateIntervalDO, isNewBooking: boolean) {
        var preprocessedInterval = this.preprocessThDateInterval(bookingInterval);

        if (!preprocessedInterval.isValid()) {
            var thError = new ThError(ThStatusCode.BookingIntervalValidatorInvalidInterval, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "invalid interval for bookings", preprocessedInterval, thError);
            reject(thError);
            return;
        }

        var bookingStartDate: ThDateDO = preprocessedInterval.start;
        if (bookingStartDate.isBefore(this._minimumBookableDate) && isNewBooking) {
            var thError = new ThError(ThStatusCode.BookingIntervalValidatorInvalidStartDate, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "invalid start date for bookings", preprocessedInterval, thError);
            reject(thError);
            return;
        }

        var numberOfDaysFromInterval = preprocessedInterval.getNumberOfDays();
        if (numberOfDaysFromInterval > BookingDOConstraints.MaxBookingNoOfDays) {
            var thError = new ThError(ThStatusCode.BookingIntervalValidatorMaxSixMonths, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "too wide booking interval", preprocessedInterval, thError);
            reject(thError);
            return;
        }

        resolve(preprocessedInterval);
    }
    private preprocessThDateInterval(interval: ThDateIntervalDO): ThDateIntervalDO {
        var convertedInterval = new ThDateIntervalDO();
        convertedInterval.buildFromObject(interval);
        return convertedInterval;
    }
}