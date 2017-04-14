import {RoomCategoryDO} from '../../../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';

export class CopyPriceProductValuesModalInput {
    private _roomCategoryList: RoomCategoryDO[];

    public constructor(roomCategoryList : RoomCategoryDO[]) {
        this._roomCategoryList = roomCategoryList;
    }
    public get roomCategoryList() : RoomCategoryDO[] {
        return this._roomCategoryList;
    }
}