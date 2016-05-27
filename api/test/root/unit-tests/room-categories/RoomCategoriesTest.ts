require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {TestUtils} from '../../../../test/helpers/TestUtils';
import {RoomCategoriesTestHelper} from './helpers/RoomCategoriesTestHelper';
import {RoomCategoryDO, RoomCategoryStatus} from '../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {SaveRoomCategoryItem} from '../../../../core/domain-layer/room-categories/SaveRoomCategoryItem';
import {DeleteRoomCategoryItem} from '../../../../core/domain-layer/room-categories/DeleteRoomCategoryItem';
import {SaveRoomCategoryItemDO} from '../../../../core/domain-layer/room-categories/SaveRoomCategoryItemDO';
import {RoomCategorySearchResultRepoDO} from '../../../../core/data-layer/room-categories/repositories/IRoomCategoryRepository';
import {RoomCategoryStatsAggregator} from '../../../../core/domain-layer/room-categories/aggregators/RoomCategoryStatsAggregator';
import {RoomCategoryStatsDO} from '../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';

describe("Hotel Room Categories Tests", function() {
    var testUtils: TestUtils;
    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
    var roomCategoriesHelper: RoomCategoriesTestHelper;
    
    var usedRoomCategoryIdList: string[];
    var createdRoomCategory: RoomCategoryDO;
    var numCreatedRoomCategories = 6;
    
	before(function(done: any) {
        testUtils = new TestUtils();
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
        roomCategoriesHelper = new RoomCategoriesTestHelper(testDataBuilder);
    });
    
	describe("Hotel Update Room Categories Flow", function() {
        it("Should not create invalid room category (displayName between 3 and 100 characters)", function(done) {
			var roomCategoryDO = roomCategoriesHelper.getRoomCategoryItemDOWithInvalidDisplayName();
			var saveRoomCategoryItem = new SaveRoomCategoryItem(testContext.appContext, testContext.sessionContext);
			saveRoomCategoryItem.save(roomCategoryDO).then((result: RoomCategoryDO) => {
				done(new Error("did manage to create a room category with invalid display name"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
        it("Should not create a room category with invalid beds", function(done) {
            var saveRoomCategoryItemDO: SaveRoomCategoryItemDO = roomCategoriesHelper.getSaveRoomCategoryItemDOWithInvalidBeds();
            var saveRoomCategoryItem = new SaveRoomCategoryItem(testContext.appContext, testContext.sessionContext);
            saveRoomCategoryItem.save(saveRoomCategoryItemDO).then((result: RoomCategoryDO) => {
                done(new Error("did manage to create a room category with invalid beds"));
            }).catch((e: ThError) => {
                should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
                done();
            });
        });
        
        it("Should create a new room category item with empty bed list", function(done) {
            var saveRoomCategoryItemDO: SaveRoomCategoryItemDO = roomCategoriesHelper.getValidWithEmptyBedListSaveRoomCategoryItemDO();
            var saveRoomCategoryItem = new SaveRoomCategoryItem(testContext.appContext, testContext.sessionContext);
            saveRoomCategoryItem.save(saveRoomCategoryItemDO).then((result: RoomCategoryDO) => {
                should.equal(result.hotelId, testContext.sessionContext.sessionDO.hotel.id);
                should.exist(result.id);
                should.equal(result.displayName, saveRoomCategoryItemDO.displayName);
                result.bedConfig.equals(saveRoomCategoryItemDO.bedConfig).should.be.true;
                numCreatedRoomCategories++;
                createdRoomCategory = result;
                
                done();    
            }).catch((e: ThError) => {
                done(e);    
            });
        });
        
        it("Should create a new room category item", function(done) {
            
            var saveRoomCategoryItemDO: SaveRoomCategoryItemDO = roomCategoriesHelper.getValidSaveRoomCategoryItemDO();
            var saveRoomCategoryItem = new SaveRoomCategoryItem(testContext.appContext, testContext.sessionContext);
            saveRoomCategoryItem.save(saveRoomCategoryItemDO).then((result: RoomCategoryDO) => {
                should.equal(result.hotelId, testContext.sessionContext.sessionDO.hotel.id);
                should.exist(result.id);
                should.equal(result.displayName, saveRoomCategoryItemDO.displayName);
                result.bedConfig.equals(saveRoomCategoryItemDO.bedConfig).should.be.true;
                numCreatedRoomCategories++;
                createdRoomCategory = result;
                
                done();    
            }).catch((e: ThError) => {
                done(e);    
            });
        });
        it("Should update the previously created room category", function(done) {
			var roomCategoryToUpdate = roomCategoriesHelper.getSavedRoomCategoryItemDOFrom(createdRoomCategory);
            roomCategoryToUpdate.displayName = "YYYYYY";
            roomCategoryToUpdate.bedConfig = roomCategoriesHelper.getRandomBedConfig(testDataBuilder.bedList, 1);
            var saveRoomCategoryItem = new SaveRoomCategoryItem(testContext.appContext, testContext.sessionContext);
            saveRoomCategoryItem.save(roomCategoryToUpdate).then((result: RoomCategoryDO) => {
                should.equal(result.hotelId, testContext.sessionContext.sessionDO.hotel.id);
                should.exist(result.id);
                should.equal(result.displayName, roomCategoryToUpdate.displayName);
                result.bedConfig.equals(roomCategoryToUpdate.bedConfig).should.be.true;
                createdRoomCategory = result;
                
                done();
            }).catch((e: ThError) => {
                done(e);
            });
        });
        it("Should not create a second room category with the same display name for the same hotel", function(done) {
            var saveRoomCategoryItem = new SaveRoomCategoryItem(testContext.appContext, testContext.sessionContext);
			var roomCategory = _.clone(createdRoomCategory);
			delete roomCategory.id;
            
            saveRoomCategoryItem.save(roomCategory).then((result: SaveRoomCategoryItemDO) => {
                done(new Error("did manage to create two room categories with the same display name"));    
            }).catch((e: ThError) => {
                should.notEqual(e.getThStatusCode, ThStatusCode.Ok);
                done();    
            });
        });
    });
    
    describe("Hotel Get Room Categories & Delete Flow", function() {
		it("Should get the previously added room categories", function(done) {
			var roomCategoryRepo = testContext.appContext.getRepositoryFactory().getRoomCategoryRepository();
			roomCategoryRepo.getRoomCategoryList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: RoomCategorySearchResultRepoDO) => {
				should.equal(result.roomCategoryList.length, numCreatedRoomCategories);

				var readRoomCategory = _.find(result.roomCategoryList, (roomCategory: RoomCategoryDO) => { return roomCategory.id === createdRoomCategory.id });
				
                roomCategoriesHelper.validate(readRoomCategory, createdRoomCategory);

				done();
			}).catch((err: any) => {
				done(err);
			});
        });
		it("Should delete one of the previously added room categories", function(done) {
			var deleteRoomCategoryItem = new DeleteRoomCategoryItem(testContext.appContext, testContext.sessionContext);
			deleteRoomCategoryItem.delete({ id: createdRoomCategory.id }).then((deletedRoomCategory: RoomCategoryDO) => {
				should.equal(deletedRoomCategory.status, RoomCategoryStatus.Deleted);
				numCreatedRoomCategories--;
				done();
			}).catch((err: any) => {
				done(err);
			});
        });
		it("Should get only the remaining room categories", function(done) {
			var roomCategoryRepo = testContext.appContext.getRepositoryFactory().getRoomCategoryRepository();
            
            roomCategoryRepo.getRoomCategoryList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: RoomCategorySearchResultRepoDO) => {
				should.equal(result.roomCategoryList.length, numCreatedRoomCategories);
				done();
			}).catch((err: any) => {
				done(err);
			});
        });
	});
    
    describe("Room Category - Room Categories Aggregator", function() {
        it("Should get all the room categories for which the hotel assigned at least a room", function(done) {
            var roomAggregator = new RoomCategoryStatsAggregator(testContext.appContext);
            roomAggregator.getUsedRoomCategoryList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((roomCategoryList: RoomCategoryDO[]) => {
                usedRoomCategoryIdList = roomCategoryList.map((roomCategory: RoomCategoryDO) => { return roomCategory.id });
                if (testUtils.stringArraysAreEqual(roomCategoriesHelper.getDistinctRoomCategoriesFrom(testDataBuilder.roomList), usedRoomCategoryIdList))
                    done();
                else
                    done(new Error("The used room categories query may be incorrect"));
            }).catch((err: any) => {
                done(err);
            });
        });

        it("Should get the room category stats for each room category id passed as argument", function(done) {
            var roomAggregator = new RoomCategoryStatsAggregator(testContext.appContext);
            
            roomAggregator.getRoomCategoryStatsList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, usedRoomCategoryIdList).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
                roomCategoriesHelper.validateRoomCategoryStatsList(roomCategoryStatsList);
                done();
            }).catch((err: any) => {
                done(err);
            });
        });
        
        it("Should get the room category stats for all the room categories if udefined is passed as room category id list", function(done) {
            var roomAggregator = new RoomCategoryStatsAggregator(testContext.appContext);
            
            roomAggregator.getRoomCategoryStatsList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, undefined).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
                should.equal(roomCategoryStatsList.length, numCreatedRoomCategories);
                done();
            }).catch((err: any) => {
                done(err);
            });
        });
        
        it("Should get empty list of room category stats if empty array is passed as room category id list", function(done) {
            var roomAggregator = new RoomCategoryStatsAggregator(testContext.appContext);
            
            roomAggregator.getRoomCategoryStatsList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, []).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
                _.isEmpty(roomCategoryStatsList).should.be.true;
                done();
            }).catch((err: any) => {
                done(err);
            });
        });
        
    });
});