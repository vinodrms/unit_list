import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ConfigCapacityDO } from "../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO";
import { IndexedBookingInterval } from '../../../../data-layer/price-products/utils/IndexedBookingInterval';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { BookingDO, BookingConfirmationStatus } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { BookingPriceDO } from "../../../../data-layer/bookings/data-objects/price/BookingPriceDO";
import { BookingSearchResultRepoDO } from '../../../../data-layer/bookings/repositories/IBookingRepository';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThHourDO } from '../../../../utils/th-dates/data-objects/ThHourDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { ThDateUtils } from '../../../../utils/th-dates/ThDateUtils';
import { ThTimestampDO } from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import { BookingUtils } from '../../../bookings/utils/BookingUtils';
import { BookingsContainer } from '../../../bookings/search-bookings/utils/occupancy-calculator/utils/BookingsContainer';
import { BookingItemContainer } from '../../../bookings/search-bookings/utils/occupancy-calculator/utils/BookingItemContainer';
import { IBookingOccupancy } from '../../../bookings/search-bookings/utils/occupancy-calculator/results/IBookingOccupancy';
import { BookingOccupancy } from '../../../bookings/search-bookings/utils/occupancy-calculator/results/BookingOccupancy';
import { IRevenueForDate } from '../data-objects/revenue/IRevenueForDate';
import { RevenueForDate } from '../data-objects/revenue/RevenueForDate';
import { InvoiceIndexer } from './invoice/InvoiceIndexer';
import { IInvoiceStats } from './invoice/IInvoiceStats';
import { RoomSnapshotDO } from "../../../../data-layer/hotel-inventory-snapshots/data-objects/room/RoomSnapshotDO";
import { IRoom } from "../../../../data-layer/rooms/data-objects/IRoom";

import _ = require('underscore');

export interface HotelInventoryIndexerParams {
    cancellationHour: ThHourDO;
    currentHotelTimestamp: ThTimestampDO;
    roomList: RoomSnapshotDO[];
}
export class HotelInventoryIndexer {
    private _bookingUtils: BookingUtils;
    private _dateUtils: ThDateUtils;
    private _indexedInterval: IndexedBookingInterval;
    private _indexedRoomsById: { [id: string]: IRoom; };
    
    private _confirmedBookingsContainer: BookingsContainer;
    private _guaranteedBookingsContainer: BookingsContainer;
    private _penaltyBookingsContainer: BookingsContainer;
    private _invoiceStats: IInvoiceStats;

    constructor(private _appContext: AppContext,
        private _sessionContext: SessionContext,
        private _indexerParams: HotelInventoryIndexerParams) {
        this._bookingUtils = new BookingUtils();
        this._dateUtils = new ThDateUtils();

        this._indexedRoomsById = _.indexBy(this._indexerParams.roomList, (room: IRoom) => { return room.id });
    }

    public indexInventory(indexedInterval: IndexedBookingInterval): Promise<boolean> {
        this._indexedInterval = indexedInterval;
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
            this.indexInventoryCore(resolve, reject);
        });
    }
    private indexInventoryCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        var invoiceIndexer = new InvoiceIndexer(this._appContext, this._sessionContext);
        invoiceIndexer.getInvoiceStats(this._indexedInterval)
            .then((invoiceStats: IInvoiceStats) => {
                this._invoiceStats = invoiceStats;

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id },
                    {
                        confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_BookingsConsideredInYieldManager,
                        interval: ThDateIntervalDO.buildThDateIntervalDO(
                            this._indexedInterval.getArrivalDate().buildPrototype(),
                            this._indexedInterval.getDepartureDate().buildPrototype()
                        )
                    });
            }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
                this.indexBookingsByType(bookingSearchResult.bookingList);
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
        var bookingOccupancy = new BookingOccupancy(this._indexedRoomsById);
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
        var invoiceRevenue = this._invoiceStats.getRevenueForDate(thDate);
        guaranteedRev.addRevenue(invoiceRevenue);
        return guaranteedRev;
    }
    private getRevenue(bookingsContainer: BookingsContainer, thDate: ThDateDO): RevenueForDate {
        var indexedSingleDayInterval = this.getSingleDayIntervalStartingFrom(thDate);
        var filteredBookingItemList: BookingItemContainer[] = bookingsContainer.getBookingItemContainersFilteredByInterval(indexedSingleDayInterval);
        var revenue = new RevenueForDate(0.0, 0.0);
        _.forEach(filteredBookingItemList, (bookingItem: BookingItemContainer) => {
            var noNights = bookingItem.indexedBookingInterval.getLengthOfStay();
            if (noNights > 0 && !this._invoiceStats.bookingHasInvoiceWithLossAcceptedByManagement(bookingItem.booking.bookingId)) {
                revenue.roomRevenue += this.getBookingRoomPriceForDate(bookingItem.booking.price, bookingItem.booking.configCapacity, noNights, thDate);
                revenue.otherRevenue += this.getBookingOtherPriceAvgPerNight(bookingItem.booking.price, bookingItem.booking.configCapacity, noNights);
            }
        });
        return revenue;
    }

    private getBookingRoomPriceForDate(bookingPrice: BookingPriceDO, bookingCapacity: ConfigCapacityDO​​, totalNoNights: number, thDate: ThDateDO): number {
        if (bookingPrice.isPenalty()) {
            return bookingPrice.totalRoomPrice / totalNoNights;
        }
        var roomPriceForNight = bookingPrice.roomPricePerNightAvg;
        // now we try to find the actual price for the specific date
        for (var i = 0; i < bookingPrice.roomPricePerNightList.length; i++) {
            let priceForNight = bookingPrice.roomPricePerNightList[i];
            if (priceForNight.thDate.isSame(thDate)) {
                roomPriceForNight = priceForNight.price;
                break;
            }
        }

        // even though breakfast is included in the room's price we remove it from the stats
        if (bookingPrice.hasBreakfast()) {
            roomPriceForNight = roomPriceForNight - (bookingPrice.breakfast.meta.getUnitPrice() * bookingCapacity.getNoAdultsAndChildren());
        }
        if (roomPriceForNight < 0) { roomPriceForNight = 0; }
        return roomPriceForNight;
    }

    private getBookingOtherPriceAvgPerNight(bookingPrice: BookingPriceDO, bookingCapacity: ConfigCapacityDO​​, totalNoNights: number): number {
        if (bookingPrice.isPenalty()) {
            return 0.0;
        }
        var otherPrice = bookingPrice.totalOtherPrice / totalNoNights;
        if (bookingPrice.hasBreakfast()) {
            otherPrice = otherPrice + (bookingPrice.breakfast.meta.getUnitPrice() * bookingCapacity.getNoAdultsAndChildren());
        }
        return otherPrice;
    }

    private getSingleDayIntervalStartingFrom(thDate: ThDateDO): IndexedBookingInterval {
        var singleDayInterval = ThDateIntervalDO.buildThDateIntervalDO(thDate.buildPrototype(), this._dateUtils.addDaysToThDateDO(thDate.buildPrototype(), 1));
        return new IndexedBookingInterval(singleDayInterval);
    }

    public destroy() {
        this._confirmedBookingsContainer.destroy();
        this._guaranteedBookingsContainer.destroy();
        this._penaltyBookingsContainer.destroy();
        this._invoiceStats.destroy();
    }
}