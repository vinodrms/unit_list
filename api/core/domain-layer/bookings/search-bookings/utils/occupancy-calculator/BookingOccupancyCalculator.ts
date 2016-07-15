import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {ThUtils} from '../../../../../utils/ThUtils';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateUtils} from '../../../../../utils/th-dates/ThDateUtils';
import {RoomDO} from '../../../../../data-layer/rooms/data-objects/RoomDO';
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
    private _bookingUtils: BookingUtils;
    private _thUtils: ThUtils;
    private _indexedRoomsById: { [id: string]: RoomDO; };

    private _interval: ThDateIntervalDO;
    private _transientBookingList: BookingDO[];
    private _bookingIdToOmit: string;

    private _bookingsContainer: BookingsContainer;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, roomList: RoomDO[]) {
        this._dateUtils = new ThDateUtils();
        this._bookingUtils = new BookingUtils();
        this._thUtils = new ThUtils();
        this._indexedRoomsById = _.indexBy(roomList, (room: RoomDO) => { return room.id });
    }

    // it computes the availability for the given period
    // the transient booking list represents an array that is not persistet in the DB but should be considered when computing the occupancy
    // the bookingIdToOmit represents an optional bookingId that is ommited from the occupancy calculator
    public compute(interval: ThDateIntervalDO, transientBookingList?: BookingDO[], bookingIdToOmit?: string): Promise<IBookingOccupancy> {
        this._interval = interval;
        this._transientBookingList = transientBookingList;
        this._bookingIdToOmit = bookingIdToOmit;
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
                var bookingList = bookingSearchResult.bookingList;
                if (!this._thUtils.isUndefinedOrNull(this._bookingIdToOmit) && _.isString(this._bookingIdToOmit)) {
                    bookingList = _.filter(bookingList, (booking: BookingDO) => { return booking.bookingId !== this._bookingIdToOmit });
                }
                if (!this._thUtils.isUndefinedOrNull(this._transientBookingList) && _.isArray(this._transientBookingList)) {
                    bookingList = bookingList.concat(this._transientBookingList);
                }

                this._bookingsContainer = new BookingsContainer(bookingList);
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
        var aggregatedBookingOccupancy: BookingOccupancy = new BookingOccupancy(this._indexedRoomsById);
        _.forEach(bookingInterval.bookingDateList, (bookingDate: ThDateDO) => {
            var bookingOccupancyForDate: BookingOccupancy = this.getBookingOccupancyForDate(bookingDate);
            aggregatedBookingOccupancy.combineWith(bookingOccupancyForDate);
        });
        resolve(aggregatedBookingOccupancy);
    }
    private getBookingOccupancyForDate(date: ThDateDO): BookingOccupancy {
        var indexedSingleDayInterval: IndexedBookingInterval = this.getSingleDayIntervalStartingFrom(date);
        var filteredBookingList: BookingDO[] = this._bookingsContainer.getBookingsFilteredByInterval(indexedSingleDayInterval);
        var bookingOccupancy = new BookingOccupancy(this._indexedRoomsById);
        bookingOccupancy.initializeFromBookings(filteredBookingList);
        return bookingOccupancy;
    }
    private getSingleDayIntervalStartingFrom(date: ThDateDO): IndexedBookingInterval {
        var singleDayInterval = ThDateIntervalDO.buildThDateIntervalDO(date.buildPrototype(), this._dateUtils.addDaysToThDateDO(date.buildPrototype(), 1));
        return new IndexedBookingInterval(singleDayInterval);
    }
}