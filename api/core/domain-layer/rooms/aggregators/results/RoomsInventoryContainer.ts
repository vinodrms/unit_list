import {RoomDO} from '../../../../data-layer/rooms/data-objects/RoomDO';
import {RoomCategoryDO} from '../../../../data-layer/room-categories/data-objects/RoomCategoryDO';
import {GenericOccurenciesIndexer} from '../../../../utils/indexers/GenericOccurenciesIndexer';

import _ = require('underscore');

export class RoomsInventoryContainer {
    private _roomList: RoomDO[];
    private _roomCategoryList: RoomCategoryDO[];

    private _indexedNoOfRoomsPerCategoryIdOccurencies: GenericOccurenciesIndexer<RoomDO>;

    constructor(roomList: RoomDO[], roomCategoryList: RoomCategoryDO[]) {
        this._roomList = roomList;
        this._roomCategoryList = roomCategoryList;
        this._indexedNoOfRoomsPerCategoryIdOccurencies = new GenericOccurenciesIndexer<RoomDO>(roomList, (room: RoomDO) => { return room.categoryId; });
    }

    public get roomList(): RoomDO[] {
        return this._roomList;
    }
    public set roomList(roomList: RoomDO[]) {
        this._roomList = roomList;
    }
    public get roomCategoryList(): RoomCategoryDO[] {
        return this._roomCategoryList;
    }
    public set roomCategoryList(roomCategoryList: RoomCategoryDO[]) {
        this._roomCategoryList = roomCategoryList;
    }

    public getTotalNumberOfRoomsFromCategory(roomCategory: RoomCategoryDO): number {
        return this._indexedNoOfRoomsPerCategoryIdOccurencies.getNoOfOccurenciesForStringElement(roomCategory.id);
    }
}