import {ThError} from '../../../utils/th-responses/ThError';
import {AppContext} from '../../../utils/AppContext';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {HotelInventorySnapshotDO} from '../../../data-layer/hotel-inventory-snapshots/data-objects/HotelInventorySnapshotDO';
import {HotelInventorySnapshotSearchResultRepoDO} from '../../../data-layer/hotel-inventory-snapshots/repositories/IHotelInventorySnapshotRepository';
import {RoomDO} from '../../../data-layer/rooms/data-objects/RoomDO';
import {RoomSearchResultRepoDO} from '../../../data-layer/rooms/repositories/IRoomRepository';
import {AllotmentDO, AllotmentStatus} from '../../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentSearchResultRepoDO} from '../../../data-layer/allotments/repositories/IAllotmentRepository';
import {SnapshotUtils} from '../utils/SnapshotUtils';

export enum InventorySnapshotType {
    New,
    Existing
}
export interface InventorySnapshotProcessResult {
    type: InventorySnapshotType;
    snapshot: HotelInventorySnapshotDO;
}

export class HotelInventorySnapshotProcess {
    private _referenceDate: ThDateDO;
    private _loadedRoomList: RoomDO[];

    constructor(private _appContext: AppContext, private _hotel: HotelDO) {
    }

    public createSnapshot(referenceDate: ThDateDO): Promise<InventorySnapshotProcessResult> {
        this._referenceDate = referenceDate;
        return new Promise<InventorySnapshotProcessResult>((resolve: { (result: InventorySnapshotProcessResult): void }, reject: { (err: ThError): void }) => {
            this.createSnapshotCore(resolve, reject);
        });
    }

    private createSnapshotCore(resolve: { (result: InventorySnapshotProcessResult): void }, reject: { (err: ThError): void }) {
        var snapshotRepo = this._appContext.getRepositoryFactory().getSnapshotRepository();
        snapshotRepo.getSnapshotList({ hotelId: this._hotel.id }, { thDateUtcTimestamp: this._referenceDate.getUtcTimestamp() })
            .then((searchResult: HotelInventorySnapshotSearchResultRepoDO) => {
                if (searchResult.snapshotList.length > 0) {
                    resolve({
                        type: InventorySnapshotType.Existing,
                        snapshot: searchResult.snapshotList[0]
                    });
                    return;
                }
                this.initSnapshot(resolve, reject);
            }).catch((error: any) => {
                reject(error);
            });
    }
    private initSnapshot(resolve: { (result: InventorySnapshotProcessResult): void }, reject: { (err: ThError): void }) {
        var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
        roomsRepo.getRoomList({ hotelId: this._hotel.id },
            { maintenanceStatusList: RoomDO.inInventoryMaintenanceStatusList })
            .then((roomSearchResult: RoomSearchResultRepoDO) => {
                this._loadedRoomList = roomSearchResult.roomList;

                var allotmentsRepo = this._appContext.getRepositoryFactory().getAllotmentRepository();
                return allotmentsRepo.getAllotmentList({ hotelId: this._hotel.id },
                    { status: AllotmentStatus.Active });
            }).then((allotSearchResult: AllotmentSearchResultRepoDO) => {
                var allotmentList: AllotmentDO[] = allotSearchResult.allotmentList;

                var snapshot = this.getSnapshot(this._loadedRoomList, allotmentList);
                var snapshotRepo = this._appContext.getRepositoryFactory().getSnapshotRepository();
                return snapshotRepo.addSnapshot({ hotelId: this._hotel.id }, snapshot);
            }).then((createdSnapshot: HotelInventorySnapshotDO) => {
                resolve({
                    type: InventorySnapshotType.New,
                    snapshot: createdSnapshot
                });
            }).catch((error: any) => {
                reject(error);
            });
    }

    private getSnapshot(roomList: RoomDO[], allotmentList: AllotmentDO[]): HotelInventorySnapshotDO {
        var snapshotUtils = new SnapshotUtils();
        var snapshot = new HotelInventorySnapshotDO();
        snapshot.hotelId = this._hotel.id;
        snapshot.thDate = this._referenceDate.buildPrototype();
        snapshot.thDateUtcTimestamp = snapshot.thDate.getUtcTimestamp();
        snapshot.roomList = snapshotUtils.buildRoomSnapshots(roomList);
        snapshot.allotments = snapshotUtils.buildAllotmentsSnapshot(allotmentList, this._referenceDate);
        return snapshot;
    }
}