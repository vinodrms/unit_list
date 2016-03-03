require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {RoomCategoriesTestHelper} from './helpers/RoomCategoriesTestHelper';
import {RoomCategoryDO} from '../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {SaveRoomCategoryItem} from '../../../../core/domain-layer/room-categories/SaveRoomCategoryItem';
import {DeleteRoomCategoryItem} from '../../../../core/domain-layer/room-categories/DeleteRoomCategoryItem';
import {SaveRoomCategoryItemDO} from '../../../../core/domain-layer/room-categories/SaveRoomCategoryItemDO';

describe("Hotel Room Categories Tests", function() {
    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
    var roomCategoriesHelper: RoomCategoriesTestHelper;
    
    var createdRoomCategory: RoomCategoryDO;
    var numCreatedRoomCategories = 3;
    
	before(function(done: any) {
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
        it("Should create a new room category item", function(done) {
            var saveRoomCategoryItemDO: SaveRoomCategoryItemDO = roomCategoriesHelper.getValidSaveRoomCategoryItemDO();
            var saveRoomCategoryItem = new SaveRoomCategoryItem(testContext.appContext, testContext.sessionContext);
            saveRoomCategoryItem.save(saveRoomCategoryItemDO).then((result: RoomCategoryDO) => {
                should.equal(result.hotelId, testContext.sessionContext.sessionDO.hotel.id);
                should.exist(result.id);
                should.equal(result.displayName, saveRoomCategoryItemDO.displayName);
                numCreatedRoomCategories++;
                createdRoomCategory = result;
                
                done();    
            }).catch((e: ThError) => {
                done(e);    
            });
        });
    });
});