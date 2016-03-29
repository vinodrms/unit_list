import {RoomCategoryDO} from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {SaveRoomCategoryItemDO} from '../../../../../core/domain-layer/room-categories/SaveRoomCategoryItemDO';

import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';

import should = require('should');

export class RoomCategoriesTestHelper {

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
    }

    public getRoomCategoryItemDOWithInvalidDisplayName(): SaveRoomCategoryItemDO {
        return {
            displayName: "Xx"
        };
    }

    public getValidSaveRoomCategoryItemDO(): SaveRoomCategoryItemDO {
        return {
            displayName: "Xxxxxxx"
        };
    }

    public getSavedRoomCategoryItemDOFrom(roomCategory: RoomCategoryDO): SaveRoomCategoryItemDO {
        var result = {
            displayName: roomCategory.displayName,
        }
        result["id"] = roomCategory.id;
        return result;
    }

    public validate(readRoomCategory: RoomCategoryDO, createdRoomCategory: RoomCategoryDO) {
        should.equal(readRoomCategory.hotelId, createdRoomCategory.hotelId);
        should.equal(readRoomCategory.displayName, createdRoomCategory.displayName);
    }
}