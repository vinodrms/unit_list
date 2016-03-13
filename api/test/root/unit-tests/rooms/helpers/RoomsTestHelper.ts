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
            bedIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.bedList, 2),
            amenityIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAmenityList, 3),
            attributeIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAttributeList, 3),
            fileUrlList: [],
            description: "Demo description",
            notes: "Demo notes",
            maintenanceStatus: RoomMaintenanceStatus.CheckInReady
        };
    }
    
    public getSaveRoomItemDOWithInvalidCategory(): SaveRoomItemDO {
        return {
            name: "Invalid Category",
            floor: 1,
            categoryId: "X",
            bedIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.bedList, 2),
            amenityIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAmenityList, 3),
            attributeIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAttributeList, 3),
            fileUrlList: [],
            description: "Demo description",
            notes: "Demo notes",
            maintenanceStatus: RoomMaintenanceStatus.CheckInReady
        };
    }
    
    public getSaveRoomItemDOWithInvalidBeds(): SaveRoomItemDO {
        return {
            name: "Invalid Beds",
            floor: 1,
            categoryId: this._testUtils.getRandomListElement(this._defaultDataBuilder.roomCategoryList).id,
            bedIdList: ["X"],
            amenityIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAmenityList, 3),
            attributeIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAttributeList, 3),
            fileUrlList: [],
            description: "Demo description",
            notes: "Demo notes",
            maintenanceStatus: RoomMaintenanceStatus.CheckInReady
        };
    }

    public getSaveRoomItemDOWithInvalidAmenities(): SaveRoomItemDO {
        return {
            name: "Invalid Amenities",
            floor: 1,
            categoryId: this._testUtils.getRandomListElement(this._defaultDataBuilder.roomCategoryList).id,
            bedIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.bedList, 2),
            amenityIdList: ["X"],
            attributeIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAttributeList, 3),
            fileUrlList: [],
            description: "Demo description",
            notes: "Demo notes",
            maintenanceStatus: RoomMaintenanceStatus.CheckInReady
        };
    }

    public getSaveRoomItemDOWithInvalidAttributes(): SaveRoomItemDO {
        return {
            name: "Invalid Attributes",
            floor: 1,
            categoryId: this._testUtils.getRandomListElement(this._defaultDataBuilder.roomCategoryList).id,
            bedIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.bedList, 2),
            amenityIdList: this._testUtils.getIdSampleFrom(this._defaultDataBuilder.roomAmenityList, 3),
            attributeIdList: ["X"],
            fileUrlList: [],
            description: "Demo description",
            notes: "Demo notes",
            maintenanceStatus: RoomMaintenanceStatus.CheckInReady
        };
    }

    public getSaveRoomItemDOFrom(room: RoomDO): SaveRoomItemDO {
        var result = {
            name: room.name,
            floor: room.floor,
            categoryId: this._testUtils.getRandomListElement(this._defaultDataBuilder.roomCategoryList).id,
            bedIdList: room.bedIdList,
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

    public getDistinctRoomCategoriesFrom(roomList: RoomDO[]): string[] {
        var roomCategoryIdList = [];
        roomList.forEach(room => {
            if (!_.contains(roomCategoryIdList, room.categoryId))
                roomCategoryIdList.push(room.categoryId);
        });
        return roomCategoryIdList;
    }

    public validateRoomCategoryStatsList(roomCategoryStatsList: RoomCategoryStatsDO[]) {
        should.equal(roomCategoryStatsList.length, 3);
        
        var categoryDisplayNameList: any = roomCategoryStatsList.map((roomCategoryStats) => { return roomCategoryStats.roomCategory.displayName });
        should.equal(_.contains(categoryDisplayNameList, 'Single Standard'), true);
        should.equal(_.contains(categoryDisplayNameList, 'Triple Standard'), true);
        should.equal(_.contains(categoryDisplayNameList, 'Double Standard'), true);
        
        roomCategoryStatsList.forEach((roomCategoryStats) => {
            if (roomCategoryStats.roomCategory.displayName === 'Single Standard') {
                should.equal(roomCategoryStats.maxNoAdults, 1);
                should.equal(roomCategoryStats.maxNoChildren, 1);
            }
            else if (roomCategoryStats.roomCategory.displayName === 'Triple Standard') {
                should.equal(roomCategoryStats.maxNoAdults, 3);
                should.equal(roomCategoryStats.maxNoChildren, 4);
            }
            else if (roomCategoryStats.roomCategory.displayName === 'Double Standard') {
                should.equal(roomCategoryStats.maxNoAdults, 2);
                should.equal(roomCategoryStats.maxNoChildren, 3);
            }
        });
    }

    public validateCreatedRoom(readRoom: RoomDO, createdRoom: RoomDO) {
        should.equal(readRoom.hotelId, createdRoom.hotelId);
        should.equal(readRoom.id, createdRoom.id);
        should.equal(readRoom.name, createdRoom.name);
        should.equal(readRoom.floor, createdRoom.floor);
        should.equal(readRoom.categoryId, createdRoom.categoryId);
        this._testUtils.stringArraysAreEqual(readRoom.bedIdList, createdRoom.bedIdList).should.be.true;
        this._testUtils.stringArraysAreEqual(readRoom.amenityIdList, createdRoom.amenityIdList).should.be.true;
        this._testUtils.stringArraysAreEqual(readRoom.attributeIdList, createdRoom.attributeIdList).should.be.true;
        should.equal(readRoom.description, createdRoom.description);
        should.equal(readRoom.notes, createdRoom.notes);
        should.equal(readRoom.maintenanceStatus, createdRoom.maintenanceStatus);
    }

}