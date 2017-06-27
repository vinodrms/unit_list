import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ThUtils } from '../../../utils/ThUtils';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThHourDO } from '../../../utils/th-dates/data-objects/ThHourDO';
import { ThTimestampDO } from '../../../utils/th-dates/data-objects/ThTimestampDO';
import { ThDateUtils } from '../../../utils/th-dates/ThDateUtils';
import { IndexedBookingInterval } from '../../../data-layer/price-products/utils/IndexedBookingInterval';
import { RoomDO } from '../../../data-layer/rooms/data-objects/RoomDO';
import { HotelInventorySnapshotDO } from '../../../data-layer/hotel-inventory-snapshots/data-objects/HotelInventorySnapshotDO';
import { RoomSnapshotDO } from '../../../data-layer/hotel-inventory-snapshots/data-objects/room/RoomSnapshotDO';
import { AllotmentDO } from '../../../data-layer/allotments/data-objects/AllotmentDO';
import { HotelInventorySnapshotSearchResultRepoDO } from '../../../data-layer/hotel-inventory-snapshots/repositories/IHotelInventorySnapshotRepository';
import { HotelInventoryStats } from './data-objects/HotelInventoryStats';
import { IHotelInventoryStats, HotelInventoryStatsForDate } from './data-objects/IHotelInventoryStats';
import { TotalInventoryForDate } from './data-objects/total-inventory/TotalInventoryForDate';
import { SnapshotUtils } from '../utils/SnapshotUtils';
import { HotelInventoryIndexer } from './indexer/HotelInventoryIndexer';
import { TaxResponseRepoDO } from "../../../data-layer/taxes/repositories/ITaxRepository";
import { TaxDO } from "../../../data-layer/taxes/data-objects/TaxDO";
import { TotalGuestsForDate } from "./data-objects/total-guests/TotalGuestsForDate";
import { CountryDO } from "../../../data-layer/common/data-objects/country/CountryDO";

import _ = require('underscore');

export interface HotelInventoryStatsParams {
    currentVatTaxList: TaxDO[];
    currentRoomList: RoomDO[];
    currentAllotmentList: AllotmentDO[];
    homeCountry: CountryDO;
    cancellationHour: ThHourDO;
    checkOutHour: ThHourDO;
    currentHotelTimestamp: ThTimestampDO;
    configurationCompletedTimestamp: ThTimestampDO;
    customerIdList: string[];
}
export class HotelInventoryStatsReader {
    private _thUtils: ThUtils;
    private _thDateUtils: ThDateUtils;
    private _snapshotUtils: SnapshotUtils;

    private _indexedInterval: IndexedBookingInterval;

    private _loadedSnapshotList: HotelInventorySnapshotDO[];
    private _currentRoomSnapshots: RoomSnapshotDO[];
    private _inventoryIndexer: HotelInventoryIndexer;
    private _minInventoryDate: ThDateDO;

    constructor(private _appContext: AppContext,
        private _sessionContext: SessionContext,
        private _readerParams: HotelInventoryStatsParams,
        private _exludeVat: boolean = false) {
        this._thUtils = new ThUtils();
        this._thDateUtils = new ThDateUtils();
        this._snapshotUtils = new SnapshotUtils();
        this._currentRoomSnapshots = this._snapshotUtils.buildRoomSnapshots(this._readerParams.currentRoomList);
        this.buildMinInventoryDate();   
    }
    private buildMinInventoryDate() {
        var configCompletedTimestamp: ThTimestampDO = this._readerParams.configurationCompletedTimestamp;
        if (this._thUtils.isUndefinedOrNull(configCompletedTimestamp) || !configCompletedTimestamp.isValid()) {
            this._minInventoryDate = this._thDateUtils.getMinThDateDO();
            return;
        }
        this._minInventoryDate = this._thDateUtils.addDaysToThDateDO(configCompletedTimestamp.thDateDO, -1);
    }

    public readInventoryForInterval(indexedInterval: IndexedBookingInterval): Promise<IHotelInventoryStats> {
        this._indexedInterval = indexedInterval;
        return new Promise<IHotelInventoryStats>((resolve: { (result: IHotelInventoryStats): void }, reject: { (err: ThError): void }) => {
            this.readInventoryForIntervalCore(resolve, reject);
        });
    }
    private readInventoryForIntervalCore(resolve: { (result: IHotelInventoryStats): void }, reject: { (err: ThError): void }) {
        var snapshotRepo = this._appContext.getRepositoryFactory().getSnapshotRepository();
        snapshotRepo.getSnapshotList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { interval: this._indexedInterval.indexedBookingInterval }).then((searchResult: HotelInventorySnapshotSearchResultRepoDO) => {
            this._loadedSnapshotList = searchResult.snapshotList;

            this._inventoryIndexer = new HotelInventoryIndexer(this._appContext, this._sessionContext, {
                homeCountry: this._readerParams.homeCountry,
                cancellationHour: this._readerParams.cancellationHour,
                checkOutHour: this._readerParams.checkOutHour,
                currentHotelTimestamp: this._readerParams.currentHotelTimestamp,
                roomList: this._currentRoomSnapshots,
                vatTaxList: this._readerParams.currentVatTaxList,
                customerIdList: this._readerParams.customerIdList
            }, this._exludeVat);
            return this._inventoryIndexer.indexInventory(this._indexedInterval);
        }).then((result: boolean) => {
            var hotelInventory = this.getHotelInventory();
            this._inventoryIndexer.destroy();
            resolve(hotelInventory);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.HotelInventoryStatsReaderError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error reading hotel stats", { interval: this._indexedInterval, session: this._sessionContext.sessionDO }, thError);
            }
            reject(thError);
        });
    }

    private getHotelInventory(): HotelInventoryStats {
        var hotelInventory = new HotelInventoryStats();
        _.forEach(this._indexedInterval.bookingDateList, (date: ThDateDO) => {
            var inventoryForDate: HotelInventoryStatsForDate = {
                date: date,
                totalInventory: this.getTotalInventoryForDate(date),
                confirmedGuestNights: this._inventoryIndexer.getConfirmedGuestNights(date),
                guaranteedGuestNights: this._inventoryIndexer.getGuaranteedGuestNights(date),
                confirmedArrivals: this._inventoryIndexer.getConfirmedArrivals(date),
                guaranteedArrivals: this._inventoryIndexer.getGuaranteedArrivals(date),
                confirmedOccupancy: this._inventoryIndexer.getConfirmedOccupancy(date),
                guaranteedOccupancy: this._inventoryIndexer.getGuaranteedOccupancy(date),
                guaranteedOccupancyOccupyingRoomsFromInventory: this._inventoryIndexer.getGuaranteedOccupyingRoomsFromInventoryOccupancy(date),
                confirmedRevenue: this._inventoryIndexer.getConfirmedRevenue(date, false),
                confirmedRevenueWithoutCommission: this._inventoryIndexer.getConfirmedRevenue(date, true),
                guaranteedRevenue: this._inventoryIndexer.getGuaranteedRevenue(date, false),
                guaranteedRevenueWithoutCommission: this._inventoryIndexer.getGuaranteedRevenue(date, true)

            }
            hotelInventory.indexHotelInventoryForDate(inventoryForDate, date);
        });
        return hotelInventory;
    }
    private getTotalInventoryForDate(date: ThDateDO): TotalInventoryForDate {
        var totalInventoryForDate = new TotalInventoryForDate();

        var snapshot = this.getSnapshotByDate(date);
        if (!this._thUtils.isUndefinedOrNull(snapshot)) {
            totalInventoryForDate.noOfRooms = snapshot.roomList.length;
            totalInventoryForDate.noOfRoomsWithAllotment = snapshot.allotments.totalNoOfRooms;
            totalInventoryForDate.indexFrom(snapshot.roomList);
            return totalInventoryForDate;
        }
        if (date.isBefore(this._minInventoryDate)) {
            totalInventoryForDate.noOfRooms = 0;
            totalInventoryForDate.noOfRoomsWithAllotment = 0;
            totalInventoryForDate.indexFrom([]);
            return totalInventoryForDate;
        }
        totalInventoryForDate.noOfRooms = this._currentRoomSnapshots.length;
        var allotmentsSnapshot = this._snapshotUtils.buildAllotmentsSnapshot(this._readerParams.currentAllotmentList, date);
        totalInventoryForDate.noOfRoomsWithAllotment = allotmentsSnapshot.totalNoOfRooms;
        totalInventoryForDate.indexFrom(this._currentRoomSnapshots);
        return totalInventoryForDate;
    }
    private getSnapshotByDate(thDateDO: ThDateDO): HotelInventorySnapshotDO {
        var thDateUtcTimestamp = thDateDO.getUtcTimestamp();
        return _.find(this._loadedSnapshotList, (snapshot: HotelInventorySnapshotDO) => {
            return snapshot.thDateUtcTimestamp === thDateUtcTimestamp;
        });
    }
}