import {RoomCategoryItemDO} from '../../../../../services/search/data-objects/room-category-item/RoomCategoryItemDO';

export class RoomAvailabilityModalInput {
    private _roomCategoryItemList : RoomCategoryItemDO[];

    constructor(roomCategoryItemList : RoomCategoryItemDO[]) {
        this._roomCategoryItemList = roomCategoryItemList;
    }

    public get roomCategoryItemList() : RoomCategoryItemDO[] {
        return this._roomCategoryItemList;
    }
}