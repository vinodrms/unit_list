import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {IndexedBookingInterval} from '../../../../data-layer/price-products/utils/IndexedBookingInterval';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {BookingDO, BookingConfirmationStatus} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingSearchResultRepoDO} from '../../../../data-layer/bookings/repositories/IBookingRepository';
import {ThDateIntervalDO} from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThHourDO} from '../../../../utils/th-dates/data-objects/ThHourDO';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateUtils} from '../../../../utils/th-dates/ThDateUtils';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import {BookingUtils} from '../../../bookings/utils/BookingUtils';
import {BookingsContainer} from '../../../bookings/search-bookings/utils/occupancy-calculator/utils/BookingsContainer';
import {BookingItemContainer} from '../../../bookings/search-bookings/utils/occupancy-calculator/utils/BookingItemContainer';
import {IBookingOccupancy} from '../../../bookings/search-bookings/utils/occupancy-calculator/results/IBookingOccupancy';
import {BookingOccupancy} from '../../../bookings/search-bookings/utils/occupancy-calculator/results/BookingOccupancy';
import {IRevenueForDate} from '../data-objects/revenue/IRevenueForDate';
import {RevenueForDate} from '../data-objects/revenue/RevenueForDate';

import _ = require('underscore');

export interface BookingIndexerParams {
    cancellationHour: ThHourDO;
    currentHotelTimestamp: ThTimestampDO;
}
export class BookingIndexer {
    private _bookingUtils: BookingUtils;
    private _dateUtils: ThDateUtils;
    private _indexedInterval: IndexedBookingInterval;

    private _confirmedBookingsContainer: BookingsContainer;
    private _guaranteedBookingsContainer: BookingsContainer;
    private _penaltyBookingsContainer: BookingsContainer;

    constructor(private _appContext: AppContext,
        private _sessionContext: SessionContext,
        private _indexerParams: BookingIndexerParams) {
        this._bookingUtils = new BookingUtils();
        this._dateUtils = new ThDateUtils();
    }

    public indexBookings(indexedInterval: IndexedBookingInterval): Promise<boolean> {
        this._indexedInterval = indexedInterval;
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
            this.indexBookingsCore(resolve, reject);
        });
    }
    private indexBookingsCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id },
            {
                confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_BookingsConsideredInYieldManager,
                interval: ThDateIntervalDO.buildThDateIntervalDO(
                    this._indexedInterval.getArrivalDate().buildPrototype(),
                    this._indexedInterval.getDepartureDate().buildPrototype()
                )
            }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
                this.indexBookingsByType(bookingSearchResult.bookingList);

                // TODO: load invoice indexer (step 1)

                resolve(true);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingsIndexerError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error indexing bookings", { interval: this._indexedInterval.indexedBookingInterval, session: this._sessionContext.sessionDO }, thError);
                }
                reject(thError);
            });
    }

    private indexBookingsByType(bookingList: BookingDO[]) {
        var confirmedBookingList = this.filterBookingsByStatus(bookingList, [BookingConfirmationStatus.Confirmed]);
        this._confirmedBookingsContainer = new BookingsContainer(confirmedBookingList);

        var guaranteedBookingList = this.filterBookingsByStatus(bookingList,
            [BookingConfirmationStatus.Guaranteed, BookingConfirmationStatus.CheckedIn, BookingConfirmationStatus.CheckedOut]);
        this._guaranteedBookingsContainer = new BookingsContainer(guaranteedBookingList);

        var penaltyBookingList = this.filterBookingsByStatus(bookingList, [BookingConfirmationStatus.NoShowWithPenalty, BookingConfirmationStatus.Cancelled]);
        penaltyBookingList = _.filter(penaltyBookingList, (booking: BookingDO) => {
            return this._bookingUtils.hasPenalty(booking, {
                cancellationHour: this._indexerParams.cancellationHour,
                currentHotelTimestamp: this._indexerParams.currentHotelTimestamp
            });
        });
        this._penaltyBookingsContainer = new BookingsContainer(penaltyBookingList);
    }
    private filterBookingsByStatus(bookingList: BookingDO[], confirmationStatusList: BookingConfirmationStatus[]): BookingDO[] {
        return _.filter(bookingList, (booking: BookingDO) => {
            return _.contains(confirmationStatusList, booking.confirmationStatus);
        });
    }

    public getConfirmedOccupancy(thDate: ThDateDO): IBookingOccupancy {
        return this.getOccupancy(this._confirmedBookingsContainer, thDate);
    }
    public getGuaranteedOccupancy(thDate: ThDateDO): IBookingOccupancy {
        return this.getOccupancy(this._guaranteedBookingsContainer, thDate);
    }
    private getOccupancy(bookingsContainer: BookingsContainer, thDate: ThDateDO): BookingOccupancy {
        var indexedSingleDayInterval = this.getSingleDayIntervalStartingFrom(thDate);
        var filteredBookingList: BookingDO[] = bookingsContainer.getBookingsFilteredByInterval(indexedSingleDayInterval);
        var bookingOccupancy = new BookingOccupancy({});
        bookingOccupancy.initializeFromBookings(filteredBookingList);
        return bookingOccupancy;
    }

    public getConfirmedRevenue(thDate: ThDateDO): IRevenueForDate {
        return this.getRevenue(this._confirmedBookingsContainer, thDate);
    }
    public getGuaranteedRevenue(thDate: ThDateDO): IRevenueForDate {
        var guaranteedRev = this.getRevenue(this._guaranteedBookingsContainer, thDate);
        var penaltyRev = this.getRevenue(this._penaltyBookingsContainer, thDate);
        guaranteedRev.addRevenue(penaltyRev);
        // TODO: get invoice price and append to guaranteedRev.otherRevenue (step 2)
        return guaranteedRev;
    }
    private getRevenue(bookingsContainer: BookingsContainer, thDate: ThDateDO): RevenueForDate {
        var indexedSingleDayInterval = this.getSingleDayIntervalStartingFrom(thDate);
        var filteredBookingItemList: BookingItemContainer[] = bookingsContainer.getBookingItemContainersFilteredByInterval(indexedSingleDayInterval);
        var revenue = new RevenueForDate(0.0, 0.0);
        _.forEach(filteredBookingItemList, (bookingItem: BookingItemContainer) => {
            var noNights = bookingItem.indexedBookingInterval.getLengthOfStay();
            if (noNights > 0) {
                revenue.roomRevenue += bookingItem.booking.price.getRoomPrice() / noNights;
                revenue.otherRevenue += bookingItem.booking.price.getOtherPrice() / noNights;
            }
        });
        return revenue;
    }

    private getSingleDayIntervalStartingFrom(thDate: ThDateDO): IndexedBookingInterval {
        var singleDayInterval = ThDateIntervalDO.buildThDateIntervalDO(thDate.buildPrototype(), this._dateUtils.addDaysToThDateDO(thDate.buildPrototype(), 1));
        return new IndexedBookingInterval(singleDayInterval);
    }

    public destroy() {
        this._confirmedBookingsContainer.destroy();
        this._guaranteedBookingsContainer.destroy();
        this._penaltyBookingsContainer.destroy();
    }
}