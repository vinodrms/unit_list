import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ConfigCapacityDO } from "../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO";
import { IndexedBookingInterval } from '../../../../data-layer/price-products/utils/IndexedBookingInterval';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { BookingDO, BookingConfirmationStatus, BookingStatus } from '../../../../data-layer/bookings/data-objects/BookingDO';
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
import { CommissionType, CommissionDO } from "../../../../data-layer/common/data-objects/commission/CommissionDO";
import { TaxDO } from "../../../../data-layer/taxes/data-objects/TaxDO";
import { ThUtils } from "../../../../utils/ThUtils";

import _ = require('underscore');

export interface HotelInventoryIndexerParams {
    cancellationHour: ThHourDO;
    checkOutHour: ThHourDO;
    currentHotelTimestamp: ThTimestampDO;
    roomList: RoomSnapshotDO[];
    vatTaxList: TaxDO[];
}
export class HotelInventoryIndexer {
    private _bookingUtils: BookingUtils;
    private _dateUtils: ThDateUtils;
    private _indexedInterval: IndexedBookingInterval;
    private _indexedRoomsById: { [id: string]: IRoom; };
    private _indexedVatById: { [id: string]: TaxDO; };

    private _confirmedBookingsContainer: BookingsContainer;
    private _guaranteedBookingsContainer: BookingsContainer;
    private _guaranteedOccupyingRoomsFromInventoryBookingsContainer: BookingsContainer;
    private _penaltyBookingsContainer: BookingsContainer;
    private _invoiceStats: IInvoiceStats;

    constructor(private _appContext: AppContext,
        private _sessionContext: SessionContext,
        private _indexerParams: HotelInventoryIndexerParams,
        private _excludeVat: boolean) {
        this._bookingUtils = new BookingUtils();
        this._dateUtils = new ThDateUtils();

        this._indexedRoomsById = _.indexBy(this._indexerParams.roomList, (room: IRoom) => { return room.id });
        this._indexedVatById = _.indexBy(this._indexerParams.vatTaxList, (tax: TaxDO) => { return tax.id });
    }

    public indexInventory(indexedInterval: IndexedBookingInterval): Promise<boolean> {
        this._indexedInterval = indexedInterval;
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
            this.indexInventoryCore(resolve, reject);
        });
    }
    private indexInventoryCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
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

                let bookingIdList = _.map(bookingSearchResult.bookingList, (booking: BookingDO) => {
                    return booking.id;
                });
                
                var invoiceIndexer = new InvoiceIndexer(this._appContext, this._sessionContext);
                return invoiceIndexer.getInvoiceStats(this._indexedInterval, bookingIdList, this._indexedVatById, this._excludeVat);
            }).then((invoiceStats: IInvoiceStats) => {
                this._invoiceStats = invoiceStats;

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

        let currentUtcTimestamp = this._indexerParams.currentHotelTimestamp.getUtcTimestamp();
        this._guaranteedOccupyingRoomsFromInventoryBookingsContainer = new BookingsContainer(
            _.filter(guaranteedBookingList, booking => {

                // always consider guaranteed and checked in bookings
                if (booking.confirmationStatus !== BookingConfirmationStatus.CheckedOut) {
                    return true;
                }

                // only consider bookings that were checked out in the past
                let latestCheckOutTimestamp = ThTimestampDO.buildThTimestampDO(booking.interval.end, this._indexerParams.checkOutHour);
                let latestCheckOutUtcTimestamp = latestCheckOutTimestamp.getUtcTimestamp();
                if (booking.checkOutUtcTimestamp <= latestCheckOutUtcTimestamp
                    && currentUtcTimestamp <= latestCheckOutUtcTimestamp) {
                    return false;
                }
                return true;
            })
        );

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
    public getGuaranteedOccupyingRoomsFromInventoryOccupancy(thDate: ThDateDO): IBookingOccupancy {
        return this.getOccupancy(this._guaranteedOccupyingRoomsFromInventoryBookingsContainer, thDate);
    }
    private getOccupancy(bookingsContainer: BookingsContainer, thDate: ThDateDO): BookingOccupancy {
        var indexedSingleDayInterval = this.getSingleDayIntervalStartingFrom(thDate);
        var filteredBookingList: BookingDO[] = bookingsContainer.getBookingsFilteredByInterval(indexedSingleDayInterval);
        var bookingOccupancy = new BookingOccupancy(this._indexedRoomsById);
        bookingOccupancy.initializeFromBookings(filteredBookingList);
        return bookingOccupancy;
    }

    public getConfirmedRevenue(thDate: ThDateDO, excludeCommission: boolean): IRevenueForDate {
        return this.getRevenue(this._confirmedBookingsContainer, thDate, excludeCommission, this._excludeVat);
    }
    public getGuaranteedRevenue(thDate: ThDateDO, excludeCommission: boolean): IRevenueForDate {
        var guaranteedRev = this.getRevenue(this._guaranteedBookingsContainer, thDate, excludeCommission, this._excludeVat);
        var penaltyRev = this.getRevenue(this._penaltyBookingsContainer, thDate, excludeCommission, this._excludeVat);
        guaranteedRev.addRevenue(penaltyRev);
        var invoiceRevenue = this._invoiceStats.getRevenueForDate(thDate);
        guaranteedRev.addRevenue(invoiceRevenue);
        return guaranteedRev;
    }
    private getRevenue(bookingsContainer: BookingsContainer, thDate: ThDateDO, excludeCommission: boolean, excludeVat: boolean): RevenueForDate {
        var indexedSingleDayInterval = this.getSingleDayIntervalStartingFrom(thDate);
        var filteredBookingItemList: BookingItemContainer[] = bookingsContainer.getBookingItemContainersFilteredByInterval(indexedSingleDayInterval);
        var revenue = new RevenueForDate(0.0, 0.0);
        _.forEach(filteredBookingItemList, (bookingItem: BookingItemContainer) => {
            var noNights = bookingItem.indexedBookingInterval.getLengthOfStay();
            if (noNights > 0 && !this._invoiceStats.bookingHasInvoiceWithLossAcceptedByManagement(bookingItem.booking.id)) {
                revenue.roomRevenue += this.getBookingRoomPriceForDate(bookingItem.booking,
                    noNights, thDate, excludeCommission, excludeVat);
                revenue.otherRevenue += this.getBookingOtherPriceAvgPerNight(bookingItem.booking,
                    noNights, excludeCommission);
            }
        });
        return revenue;
    }

    private getBookingRoomPriceForDate(booking: BookingDO, totalNoNights: number,
        thDate: ThDateDO, excludeCommission: boolean, excludeVat: boolean): number {

        let bookingPrice = booking.price;
        let bookingCapacity = booking.configCapacity;

        if (bookingPrice.isPenalty()) {
            let price = bookingPrice.totalRoomPrice / totalNoNights;
            return excludeVat ?  this.getNetValue(bookingPrice.getVatId(), price) : price;
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

        if (excludeCommission) {
            roomPriceForNight = this.getPriceWithoutCommission(roomPriceForNight, bookingPrice.commissionSnapshot, totalNoNights);
        }

        // commission has vat included
        return excludeVat ? this.getNetValue(bookingPrice.getVatId(), roomPriceForNight) : roomPriceForNight;
    }

    private getBookingOtherPriceAvgPerNight(booking: BookingDO, totalNoNights: number,
        excludeCommission: boolean = false): number {

        let bookingPrice = booking.price;
        let bookingCapacity = booking.configCapacity;

        if (bookingPrice.isPenalty()) {
            return 0.0;
        }

        let otherPrice = 0.0;
        if (this._excludeVat) {
            let bookingUtils = new BookingUtils();
            let netOtherTotalPrice = bookingUtils.getIncludedInvoiceItems(booking.priceProductSnapshot, booking.configCapacity, 
                this._indexedInterval).getNetTotalPrice(this._indexedVatById);
            otherPrice = netOtherTotalPrice;
        }
        else {
            otherPrice = bookingPrice.totalOtherPrice;
        }
        otherPrice /= totalNoNights;

        if (bookingPrice.hasBreakfast()) {
            let breakfastPrice = bookingPrice.breakfast.meta.getUnitPrice() * bookingCapacity.getNoAdultsAndChildren();
            if (excludeCommission) {
                breakfastPrice = this.getPriceWithoutCommission(breakfastPrice, bookingPrice.commissionSnapshot, totalNoNights);
            }
            if (this._excludeVat) {
                breakfastPrice = this.getNetValue(bookingPrice.getVatId(), breakfastPrice);
            }
            otherPrice = otherPrice + breakfastPrice;
        }
        return otherPrice;
    }

    private getPriceWithoutCommission(price: number, commission: CommissionDO, totalNoNights: number) {
        let commissionAmount = commission.getCommissionFor(price);

        if (commission.type === CommissionType.Fixed) {
            commissionAmount = commissionAmount / totalNoNights;
        }

        return price - commissionAmount;
    }

    private getSingleDayIntervalStartingFrom(thDate: ThDateDO): IndexedBookingInterval {
        var singleDayInterval = ThDateIntervalDO.buildThDateIntervalDO(thDate.buildPrototype(), this._dateUtils.addDaysToThDateDO(thDate.buildPrototype(), 1));
        return new IndexedBookingInterval(singleDayInterval);
    }

    private getNetValue(vatId: string, price: number): number {
        let vat = this._indexedVatById[vatId];

        let thUtils = new ThUtils();
        if(thUtils.isUndefinedOrNull(vat)) {
            return price;
        }

        return vat.getNetValue(price);
    } 

    public destroy() {
        this._confirmedBookingsContainer.destroy();
        this._guaranteedBookingsContainer.destroy();
        this._penaltyBookingsContainer.destroy();
        this._invoiceStats.destroy();
    }
}