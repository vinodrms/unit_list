import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {ThTimestampDO} from '../../../utils/th-dates/data-objects/ThTimestampDO';
import {RoomSnapshotDO} from '../../../data-layer/hotel-inventory-snapshots/data-objects/room/RoomSnapshotDO';
import {HotelInventorySnapshotDO} from '../../../data-layer/hotel-inventory-snapshots/data-objects/HotelInventorySnapshotDO';
import {HotelInventorySnapshotSearchResultRepoDO} from '../../../data-layer/hotel-inventory-snapshots/repositories/IHotelInventorySnapshotRepository';
import {RoomDO} from '../../../data-layer/rooms/data-objects/RoomDO';
import {RoomSearchResultRepoDO} from '../../../data-layer/rooms/repositories/IRoomRepository';

import _ = require('underscore');

export enum InventorySnapshotType {
    New,
    Existing
}
export interface InventorySnapshotProcessResult {
    type: InventorySnapshotType;
    snapshot: HotelInventorySnapshotDO;
}

export class HotelInventorySnapshotProcess {
    private _referenceTimestamp: ThTimestampDO;

    constructor(private _appContext: AppContext, private _hotel: HotelDO) {
    }

    public createSnapshot(referenceTimestamp: ThTimestampDO): Promise<InventorySnapshotProcessResult> {
        this._referenceTimestamp = referenceTimestamp;
        return new Promise<InventorySnapshotProcessResult>((resolve: { (result: InventorySnapshotProcessResult): void }, reject: { (err: ThError): void }) => {
            this.createSnapshotCore(resolve, reject);
        });
    }

    private createSnapshotCore(resolve: { (result: InventorySnapshotProcessResult): void }, reject: { (err: ThError): void }) {
        var snapshotRepo = this._appContext.getRepositoryFactory().getSnapshotRepository();
        snapshotRepo.getSnapshotList({ hotelId: this._hotel.id }, { thDateUtcTimestamp: this._referenceTimestamp.thDateDO.getUtcTimestamp() })
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
                var roomList: RoomDO[] = roomSearchResult.roomList;
                var snapshot = this.getSnapshot(roomList);
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

    private getSnapshot(roomList: RoomDO[]): HotelInventorySnapshotDO {
        var snapshot = new HotelInventorySnapshotDO();
        snapshot.hotelId = this._hotel.id;
        snapshot.thDate = this._referenceTimestamp.thDateDO.buildPrototype();
        snapshot.thDateUtcTimestamp = snapshot.thDate.getUtcTimestamp();
        snapshot.roomList = [];
        _.forEach(roomList, (roomDO: RoomDO) => {
            if (roomDO.isInInventory) {
                var roomSnapshot = new RoomSnapshotDO();
                roomSnapshot.id = roomDO.id;
                roomSnapshot.categoryId = roomDO.categoryId;
                snapshot.roomList.push(roomSnapshot);
            }
        });
        return snapshot;
    }
}