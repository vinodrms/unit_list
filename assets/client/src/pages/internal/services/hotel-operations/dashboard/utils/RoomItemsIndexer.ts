import {RoomCategoryStatsDO} from '../../../room-categories/data-objects/RoomCategoryStatsDO';
import {RoomVM} from '../../../rooms/view-models/RoomVM';

import * as _ from "underscore";

export class RoomItemsIndexer {
    private _indexedRoomsById: { [id: string]: RoomVM; };
    private _indexedRoomCategStatsById: { [id: string]: RoomCategoryStatsDO; };

    constructor(roomCategoryStatsList: RoomCategoryStatsDO[], roomVMList: RoomVM[]) {
        this.indexRoomList(roomVMList);
        this.indexRoomCategoryStatsList(roomCategoryStatsList);
    }
    private indexRoomList(roomVMList: RoomVM[]) {
        this._indexedRoomsById = _.indexBy(roomVMList, (roomVM: RoomVM) => { return roomVM.room.id });
    }
    private indexRoomCategoryStatsList(roomCategoryStatsList: RoomCategoryStatsDO[]) {
        this._indexedRoomCategStatsById = _.indexBy(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => { return roomCategoryStats.roomCategory.id });
    }

    public getRoomCategoryStatsDOById(roomCategoryId: string): RoomCategoryStatsDO {
        return this._indexedRoomCategStatsById[roomCategoryId];
    }
    public getRoomVMById(roomId: string): RoomVM {
        return this._indexedRoomsById[roomId];
    }
}