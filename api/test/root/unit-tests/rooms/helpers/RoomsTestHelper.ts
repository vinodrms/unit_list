import {BedDO} from '../../../../../core/data-layer/common/data-objects/bed/BedDO';
import {RoomDO, RoomStatus, RoomMaintenanceStatus} from '../../../../../core/data-layer/rooms/data-objects/RoomDO';
import {RoomCategoryDO} from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';

import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {SaveRoomItemDO} from '../../../../../core/domain-layer/rooms/SaveRoomItemDO';
import {RoomCategoryStatsDO} from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {TestUtils} from '../../../../helpers/TestUtils';

import should = require('should');
import _ = require('underscore');

export class RoomsTestHelper {
    private _testUtils: TestUtils;

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
        this._testUtils = new TestUtils();
    }

    public getValidSaveRoomItemDO(): SaveRoomItemDO {
        return {
            name: "Demo Room",
            floor: 1,
            categoryId: this._testUtils.getRandomListElement(this._defaultDataBuilder.roomCategoryList).id,
            amenityIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAmenityList, 3),
            attributeIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAttributeList, 3),
            fileUrlList: [],
            description: "Demo description",
            notes: "Demo notes"
        };
    }

    public getSaveRoomItemDOWithInvalidCategory(): SaveRoomItemDO {
        return {
            name: "Invalid Category",
            floor: 1,
            categoryId: "X",
            amenityIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAmenityList, 3),
            attributeIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAttributeList, 3),
            fileUrlList: [],
            description: "Demo description",
            notes: "Demo notes"
        };
    }

    public getSaveRoomItemDOWithInvalidAmenities(): SaveRoomItemDO {
        return {
            name: "Invalid Amenities",
            floor: 1,
            categoryId: this._testUtils.getRandomListElement(this._defaultDataBuilder.roomCategoryList).id,
            amenityIdList: ["X"],
            attributeIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAttributeList, 3),
            fileUrlList: [],
            description: "Demo description",
            notes: "Demo notes"
        };
    }

    public getSaveRoomItemDOWithInvalidAttributes(): SaveRoomItemDO {
        return {
            name: "Invalid Attributes",
            floor: 1,
            categoryId: this._testUtils.getRandomListElement(this._defaultDataBuilder.roomCategoryList).id,
            amenityIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAmenityList, 3),
            attributeIdList: ["X"],
            fileUrlList: [],
            description: "Demo description",
            notes: "Demo notes"
        };
    }

    public getSaveRoomItemDOFrom(room: RoomDO): SaveRoomItemDO {
        var result = {
            name: room.name,
            floor: room.floor,
            categoryId: this._testUtils.getRandomListElement(this._defaultDataBuilder.roomCategoryList).id,
            amenityIdList: room.amenityIdList,
            attributeIdList: room.attributeIdList,
            fileUrlList: room.fileUrlList,
            description: room.description,
            notes: room.notes,
            maintenanceStatus: room.maintenanceStatus
        };

        result["id"] = room.id;
        return result;
    }

    public validateCreatedRoom(readRoom: RoomDO, createdRoom: RoomDO) {
        should.equal(readRoom.hotelId, createdRoom.hotelId);
        should.equal(readRoom.id, createdRoom.id);
        should.equal(readRoom.name, createdRoom.name);
        should.equal(readRoom.floor, createdRoom.floor);
        should.equal(readRoom.categoryId, createdRoom.categoryId);
        this._testUtils.stringArraysAreEqual(readRoom.amenityIdList, createdRoom.amenityIdList).should.be.true;
        this._testUtils.stringArraysAreEqual(readRoom.attributeIdList, createdRoom.attributeIdList).should.be.true;
        should.equal(readRoom.description, createdRoom.description);
        should.equal(readRoom.notes, createdRoom.notes);
        should.equal(readRoom.maintenanceStatus, createdRoom.maintenanceStatus);
        should.equal(readRoom.rollawayBedStatus, createdRoom.rollawayBedStatus);
    }

}