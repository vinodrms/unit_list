import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {ThHourDO} from '../../../utils/th-dates/data-objects/ThHourDO';
import {ThTimestampDO} from '../../../utils/th-dates/data-objects/ThTimestampDO';
import {IndexedBookingInterval} from '../../../data-layer/price-products/utils/IndexedBookingInterval';
import {RoomDO} from '../../../data-layer/rooms/data-objects/RoomDO';
import {HotelInventorySnapshotDO} from '../../../data-layer/hotel-inventory-snapshots/data-objects/HotelInventorySnapshotDO';
import {RoomSnapshotDO} from '../../../data-layer/hotel-inventory-snapshots/data-objects/room/RoomSnapshotDO';
import {AllotmentDO} from '../../../data-layer/allotments/data-objects/AllotmentDO';
import {HotelInventorySnapshotSearchResultRepoDO} from '../../../data-layer/hotel-inventory-snapshots/repositories/IHotelInventorySnapshotRepository';
import {HotelInventoryStats} from './data-objects/HotelInventoryStats';
import {IHotelInventoryStats, HotelInventoryStatsForDate} from './data-objects/IHotelInventoryStats';
import {TotalInventoryForDate} from './data-objects/total-inventory/TotalInventoryForDate';
import {SnapshotUtils} from '../utils/SnapshotUtils';
import {BookingIndexer} from './indexer/BookingIndexer';

export interface HotelInventoryStatsParams {
    currentRoomList: RoomDO[];
    currentAllotmentList: AllotmentDO[];
    cancellationHour: ThHourDO;
    currentHotelTimestamp: ThTimestampDO;
}
export class HotelInventoryStatsReader {
    private _thUtils: ThUtils;
    private _snapshotUtils: SnapshotUtils;

    private _indexedInterval: IndexedBookingInterval;

    private _loadedSnapshotList: HotelInventorySnapshotDO[];
    private _currentRoomSnapshots: RoomSnapshotDO[];
    private _bookingIndexer: BookingIndexer;

    constructor(private _appContext: AppContext,
        private _sessionContext: SessionContext,
        private _readerParams: HotelInventoryStatsParams) {
        this._thUtils = new ThUtils();
        this._snapshotUtils = new SnapshotUtils();
        this._currentRoomSnapshots = this._snapshotUtils.buildRoomSnapshots(this._readerParams.currentRoomList);
    }

    public readInventoryForInterval(indexedInterval: IndexedBookingInterval): Promise<IHotelInventoryStats> {
        this._indexedInterval = indexedInterval;
        return new Promise<IHotelInventoryStats>((resolve: { (result: IHotelInventoryStats): void }, reject: { (err: ThError): void }) => {
            this.readInventoryForIntervalCore(resolve, reject);
        });
    }
    private readInventoryForIntervalCore(resolve: { (result: IHotelInventoryStats): void }, reject: { (err: ThError): void }) {
        var snapshotRepo = this._appContext.getRepositoryFactory().getSnapshotRepository();
        snapshotRepo.getSnapshotList({ hotelId: this._sessionContext.sessionDO.hotel.id },
            { interval: this._indexedInterval.indexedBookingInterval })
            .then((searchResult: HotelInventorySnapshotSearchResultRepoDO) => {
                this._loadedSnapshotList = searchResult.snapshotList;

                this._bookingIndexer = new BookingIndexer(this._appContext, this._sessionContext, {
                    cancellationHour: this._readerParams.cancellationHour,
                    currentHotelTimestamp: this._readerParams.currentHotelTimestamp
                });
                return this._bookingIndexer.indexBookings(this._indexedInterval);
            }).then((result: boolean) => {
                var hotelInventory = this.getHotelInventory();
                this._bookingIndexer.destroy();
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
                totalInventory: this.getTotalInventoryForDate(date),
                confirmedOccupancy: this._bookingIndexer.getConfirmedOccupancy(date),
                guaranteedOccupancy: this._bookingIndexer.getGuaranteedOccupancy(date),
                confirmedRevenue: this._bookingIndexer.getConfirmedRevenue(date),
                guaranteedRevenue: this._bookingIndexer.getGuaranteedRevenue(date)
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
            return totalInventoryForDate;
        }
        totalInventoryForDate.noOfRooms = this._currentRoomSnapshots.length;
        var allotmentsSnapshot = this._snapshotUtils.buildAllotmentsSnapshot(this._readerParams.currentAllotmentList, date);
        totalInventoryForDate.noOfRoomsWithAllotment = allotmentsSnapshot.totalNoOfRooms;
        return totalInventoryForDate;
    }
    private getSnapshotByDate(thDateDO: ThDateDO): HotelInventorySnapshotDO {
        var thDateUtcTimestamp = thDateDO.getUtcTimestamp();
        return _.find(this._loadedSnapshotList, (snapshot: HotelInventorySnapshotDO) => {
            return snapshot.thDateUtcTimestamp === thDateUtcTimestamp;
        });
    }
}