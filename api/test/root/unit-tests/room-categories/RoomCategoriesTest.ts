require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {RoomCategoriesTestHelper} from './helpers/RoomCategoriesTestHelper';
import {RoomCategoryDO} from '../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';

describe("Hotel Room Categories Tests", function() {
    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
    var roomCategoriesHelper: RoomCategoriesTestHelper;

	before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
        roomCategoriesHelper = new RoomCategoriesTestHelper(testDataBuilder);
    });
    
	describe("Hotel Update Room Categories Flow", function() {
        it("Dummy test", function(done) {
			done();
        });
    });
});