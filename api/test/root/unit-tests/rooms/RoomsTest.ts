require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {TestUtils} from '../../../../test/helpers/TestUtils';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {RoomsTestHelper} from './helpers/RoomsTestHelper';
import {RoomDO, RoomStatus} from '../../../../core/data-layer/rooms/data-objects/RoomDO';
import {RoomCategoryDO} from '../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {RoomCategorySearchResultRepoDO} from '../../../../core/data-layer/room-categories/repositories/IRoomCategoryRepository';
import {RoomSearchResultRepoDO} from '../../../../core/data-layer/rooms/repositories/IRoomRepository';
import {SaveRoomItemDO} from '../../../../core/domain-layer/rooms/SaveRoomItemDO';
import {SaveRoomItem} from '../../../../core/domain-layer/rooms/SaveRoomItem';
import {DeleteRoomItem} from '../../../../core/domain-layer/rooms/DeleteRoomItem';
import {RoomCategoryStatsDO} from '../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';

describe("Hotel Rooms Tests", function () {
    var testUtils: TestUtils;
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;
    var roomsHelper: RoomsTestHelper;
    var createdRoom: RoomDO;
    var numCreatedRooms = 7;

    before(function (done: any) {
        testUtils = new TestUtils();
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        testDataBuilder.buildWithDoneCallback(done);
        roomsHelper = new RoomsTestHelper(testDataBuilder);
    });

    describe("Hotel Update Rooms Flow", function () {
        it("Should not create room with invalid category", function (done) {
            var saveRoomItemDO: SaveRoomItemDO = roomsHelper.getSaveRoomItemDOWithInvalidCategory();
            var saveRoomItem = new SaveRoomItem(testContext.appContext, testContext.sessionContext);
            saveRoomItem.save(saveRoomItemDO).then((result: RoomDO) => {
                done(new Error("did manage to create a room with invalid category"));
            }).catch((e: ThError) => {
                should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
                done();
            });
        });

        it("Should not create room with invalid amenities", function (done) {
            var saveRoomItemDO: SaveRoomItemDO = roomsHelper.getSaveRoomItemDOWithInvalidAmenities();
            var saveRoomItem = new SaveRoomItem(testContext.appContext, testContext.sessionContext);
            saveRoomItem.save(saveRoomItemDO).then((result: RoomDO) => {
                done(new Error("did manage to create a room with invalid amenities"));
            }).catch((e: ThError) => {
                should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
                done();
            });
        });
        it("Should not create room with invalid attributes", function (done) {
            var saveRoomItemDO: SaveRoomItemDO = roomsHelper.getSaveRoomItemDOWithInvalidAttributes();
            var saveRoomItem = new SaveRoomItem(testContext.appContext, testContext.sessionContext);
            saveRoomItem.save(saveRoomItemDO).then((result: RoomDO) => {
                done(new Error("did manage to create a room with invalid attributes"));
            }).catch((e: ThError) => {
                should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
                done();
            });
        });
        it("Should create a new room item", function (done) {
            var saveRoomItemDO: SaveRoomItemDO = roomsHelper.getValidSaveRoomItemDO();
            var saveRoomItem = new SaveRoomItem(testContext.appContext, testContext.sessionContext);

            saveRoomItem.save(saveRoomItemDO).then((result: RoomDO) => {
                should.equal(result.hotelId, testContext.sessionContext.sessionDO.hotel.id);
                should.exist(result.id);
                should.equal(result.name, saveRoomItemDO.name);
                should.equal(result.floor, saveRoomItemDO.floor);
                should.equal(result.categoryId, saveRoomItemDO.categoryId);
                testUtils.stringArraysAreEqual(result.amenityIdList, saveRoomItemDO.amenityIdList).should.be.true;
                testUtils.stringArraysAreEqual(result.attributeIdList, saveRoomItemDO.attributeIdList).should.be.true;
                should.equal(result.description, saveRoomItemDO.description);
                should.equal(result.notes, saveRoomItemDO.notes);

                numCreatedRooms++;
                createdRoom = result;

                done();
            }).catch((e: ThError) => {
                done(e);
            });
        });
        it("Should update the previously created room", function (done) {
            var roomToUpdate = roomsHelper.getSaveRoomItemDOFrom(createdRoom);

            roomToUpdate.floor = 20;
            roomToUpdate.categoryId = testUtils.getRandomListElement(testDataBuilder.roomCategoryList).id;
            roomToUpdate.amenityIdList = testUtils.getIdSampleFrom(testDataBuilder.roomAmenityList, 4);
            roomToUpdate.attributeIdList = testUtils.getIdSampleFrom(testDataBuilder.roomAttributeList, 3);
            roomToUpdate.description = "New description";
            roomToUpdate.notes = "New notes";

            var saveBedItem = new SaveRoomItem(testContext.appContext, testContext.sessionContext);
            saveBedItem.save(roomToUpdate).then((result: RoomDO) => {
                should.equal(result.hotelId, testContext.sessionContext.sessionDO.hotel.id);
                should.exist(result.id);
                should.equal(result.name, roomToUpdate.name);
                should.equal(result.floor, roomToUpdate.floor);
                should.equal(result.categoryId, roomToUpdate.categoryId);
                testUtils.stringArraysAreEqual(result.amenityIdList, roomToUpdate.amenityIdList).should.be.true;
                testUtils.stringArraysAreEqual(result.attributeIdList, roomToUpdate.attributeIdList).should.be.true;
                should.equal(result.description, roomToUpdate.description);
                should.equal(result.notes, roomToUpdate.notes);

                createdRoom = result;

                done();
            }).catch((e: ThError) => {
                done(e);
            });
        });
        it("Should not create a second room with the same name for the same hotel", function (done) {
            var newRoom = roomsHelper.getValidSaveRoomItemDO();
            var saveRoomItem = new SaveRoomItem(testContext.appContext, testContext.sessionContext);

            saveRoomItem.save(newRoom).then((result: RoomDO) => {
                done(new Error("did manage to create two rooms with the same name"));
            }).catch((e: ThError) => {
                should.notEqual(e.getThStatusCode, ThStatusCode.Ok);
                done();
            });
        });
    });

    describe("Hotel Get Rooms & Delete Flow", function () {
        it("Should get the previously added rooms", function (done) {
            var roomRepo = testContext.appContext.getRepositoryFactory().getRoomRepository();
            roomRepo.getRoomList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: RoomSearchResultRepoDO) => {
                should.equal(result.roomList.length, numCreatedRooms);
                var readRoom = _.find(result.roomList, (room: RoomDO) => { return room.id === createdRoom.id });
                roomsHelper.validateCreatedRoom(readRoom, createdRoom);
                done();
            }).catch((err: any) => {
                done(err);
            });
        });
        it("Should delete one of the previously added rooms", function (done) {
            var deleteRoomItem = new DeleteRoomItem(testContext.appContext, testContext.sessionContext);
            deleteRoomItem.delete({ id: createdRoom.id }).then((deletedRoom: RoomDO) => {
                should.equal(deletedRoom.status, RoomStatus.Deleted);
                numCreatedRooms--;
                done();
            }).catch((err: any) => {
                done(err);
            });
        });
        it("Should get only the remaining rooms", function (done) {
            var roomRepo = testContext.appContext.getRepositoryFactory().getRoomRepository();

            roomRepo.getRoomList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: RoomSearchResultRepoDO) => {
                should.equal(result.roomList.length, numCreatedRooms);
                done();
            }).catch((err: any) => {
                done(err);
            });
        });
    });
});