import {RoomCategoryDO} from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {SaveRoomCategoryItemDO} from '../../../../../core/domain-layer/room-categories/SaveRoomCategoryItemDO';

import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';

import should = require('should');

export class RoomCategoriesTestHelper {

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
    }
    
    public getRoomCategoryItemDOWithInvalidDisplayName(): SaveRoomCategoryItemDO {
        return {
            hotelId: this._defaultDataBuilder.hotelDO.id,
            displayName: "Xx"
        };
    }
    
    public getValidSaveRoomCategoryItemDO(): SaveRoomCategoryItemDO {
        return {
            hotelId: this._defaultDataBuilder.hotelDO.id,
            displayName: "Xxxxxxx"
        };
    }
    
    public getSavedRoomCategoryItemDOFrom(roomCategory: RoomCategoryDO): SaveRoomCategoryItemDO {
        var result = {
            hotelId: roomCategory.hotelId,
            displayName: roomCategory.displayName,
            status: roomCategory.status
        }
        result["id"] = roomCategory.id;
        return result;
    }
}