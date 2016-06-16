import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {BookingUtils} from './BookingUtils';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateUtils} from '../../../utils/th-dates/ThDateUtils';
import {BookingDOConstraints} from '../../../data-layer/bookings/data-objects/BookingDOConstraints';

export class BookingIntervalValidator {
    private _thDateUtils: ThDateUtils;
    private _bookingUtils: BookingUtils;
    private _bookingInterval: ThDateIntervalDO;

    constructor(private _hotelDO: HotelDO) {
        this._thDateUtils = new ThDateUtils();
        this._bookingUtils = new BookingUtils();
    }

    public validateBookingInterval(bookingInterval: ThDateIntervalDO): Promise<ThDateIntervalDO> {
        this._bookingInterval = bookingInterval;

        return new Promise<ThDateIntervalDO>((resolve: { (result: ThDateIntervalDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.validateBookingIntervalCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.BookingIntervalValidatorError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error validating booking interval", this._bookingInterval, thError);
                reject(thError);
            }
        });
    }

    private validateBookingIntervalCore(resolve: { (result: ThDateIntervalDO): void }, reject: { (err: ThError): void }) {
        this.updateBookingInterval();

        if (!this._bookingInterval.isValid()) {
            var thError = new ThError(ThStatusCode.BookingIntervalValidatorInvalidInterval, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "invalid interval for bookings", this._bookingInterval, thError);
            reject(thError);
            return;
        }

        var minBookableDate: ThDateDO = this.getMinimumBookableDate();
        var bookingStartDate: ThDateDO = this._bookingInterval.start;
        if (bookingStartDate.isBefore(minBookableDate)) {
            var thError = new ThError(ThStatusCode.BookingIntervalValidatorInvalidStartDate, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "invalid start date for bookings", this._bookingInterval, thError);
            reject(thError);
            return;
        }

        var numberOfDaysFromInterval = this._bookingInterval.getNumberOfDays();
        if (numberOfDaysFromInterval > BookingDOConstraints.MaxBookingNoOfDays) {
            var thError = new ThError(ThStatusCode.BookingIntervalValidatorMaxSixMonths, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "too wide booking interval", this._bookingInterval, thError);
            reject(thError);
            return;
        }

        resolve(this._bookingInterval);
    }

    private updateBookingInterval() {
        var bookingInterval = new ThDateIntervalDO();
        bookingInterval.buildFromObject(this._bookingInterval);
        this._bookingInterval = bookingInterval;
    }

    private getMinimumBookableDate(): ThDateDO {
        var todayDate = this._bookingUtils.getCurrentThDateForHotel(this._hotelDO);
        var yesterdayDate = this._thDateUtils.addDaysToThDateDO(todayDate, -1);
        return yesterdayDate;
    }
}