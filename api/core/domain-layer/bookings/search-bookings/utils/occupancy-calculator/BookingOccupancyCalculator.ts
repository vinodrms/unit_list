import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateUtils} from '../../../../../utils/th-dates/ThDateUtils';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingDOConstraints} from '../../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {BookingSearchResultRepoDO} from '../../../../../data-layer/bookings/repositories/IBookingRepository';
import {IndexedBookingInterval} from '../../../../../data-layer/price-products/utils/IndexedBookingInterval';
import {BookingOccupancy} from './results/BookingOccupancy';
import {IBookingOccupancy} from './results/IBookingOccupancy';
import {BookingsContainer} from './utils/BookingsContainer';
import {BookingUtils} from './utils/BookingUtils';

import _ = require('underscore');

export class BookingOccupancyCalculator {
    private _dateUtils: ThDateUtils;
    private _interval: ThDateIntervalDO;
    private _bookingUtils: BookingUtils;

    private _bookingsContainer: BookingsContainer;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._dateUtils = new ThDateUtils();
        this._bookingUtils = new BookingUtils();
    }

    public compute(interval: ThDateIntervalDO): Promise<IBookingOccupancy> {
        this._interval = interval;
        return new Promise<IBookingOccupancy>((resolve: { (result: IBookingOccupancy): void }, reject: { (err: ThError): void }) => {
            try {
                this.computeCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.BookingOccupancyCalculatorError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error computing booking occupancy", { interval: this._interval, session: this._sessionContext.sessionDO }, thError);
                reject(thError);
            }
        });
    }
    private computeCore(resolve: { (result: BookingOccupancy): void }, reject: { (err: ThError): void }) {
        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id },
            {
                confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_OccupyingRoomsFromInventory,
                interval: this._interval
            }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
                this._bookingsContainer = new BookingsContainer(bookingSearchResult.bookingList);
                return this.computeBookingOccupancy();
            }).then((bookingOccupancy: BookingOccupancy) => {
                this._bookingsContainer.destroy();
                resolve(bookingOccupancy);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingOccupancyCalculatorError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error computing booking occupancy - promise list", { interval: this._interval, session: this._sessionContext.sessionDO }, thError);
                }
                reject(thError);
            });
    }

    private computeBookingOccupancy(): Promise<BookingOccupancy> {
        return new Promise<BookingOccupancy>((resolve: { (result: BookingOccupancy): void }, reject: { (err: ThError): void }) => {
            try {
                this.computeBookingOccupancyCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.BookingOccupancyCalculatorErrorIndexing, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error indexing booking occupancy", { interval: this._interval, session: this._sessionContext.sessionDO }, thError);
                reject(thError);
            }
        });
    }
    private computeBookingOccupancyCore(resolve: { (result: BookingOccupancy): void }, reject: { (err: ThError): void }) {
        var bookingInterval: IndexedBookingInterval = new IndexedBookingInterval(this._interval);
        var aggregatedBookingOccupancy: BookingOccupancy = new BookingOccupancy();
        _.forEach(bookingInterval.bookingDateList, (bookingDate: ThDateDO) => {
            var bookingOccupancyForDate: BookingOccupancy = this.getBookingOccupancyForDate(bookingDate);
            aggregatedBookingOccupancy.combineWith(bookingOccupancyForDate);
        });
        resolve(aggregatedBookingOccupancy);
    }
    private getBookingOccupancyForDate(date: ThDateDO): BookingOccupancy {
        var indexedSingleDayInterval: IndexedBookingInterval = this.getSingleDayIntervalStartingFrom(date);
        var filteredBookingList: BookingDO[] = this._bookingsContainer.getBookingsFilteredByInterval(indexedSingleDayInterval);
        var bookingOccupancy = new BookingOccupancy();
        bookingOccupancy.initializeFromBookings(filteredBookingList);
        return bookingOccupancy;
    }
    private getSingleDayIntervalStartingFrom(date: ThDateDO): IndexedBookingInterval {
        var singleDayInterval = ThDateIntervalDO.buildThDateIntervalDO(date.buildPrototype(), this._dateUtils.addDaysToThDateDO(date.buildPrototype(), 1));
        return new IndexedBookingInterval(singleDayInterval);
    }
}