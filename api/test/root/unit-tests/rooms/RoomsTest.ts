require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {RoomsTestHelper} from './helpers/RoomsTestHelper';

import {RoomDO, RoomStatus, RoomMaintenanceStatus} from '../../../../core/data-layer/rooms/data-objects/RoomDO';
import {BedDO} from '../../../../core/data-layer/common/data-objects/bed/BedDO';

describe("Hotel Rooms Tests", function() {
    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
    var roomsHelper: RoomsTestHelper;
	var createdBed: BedDO;
	
	var numCreatedBeds = 2;

	before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
        roomsHelper = new RoomsTestHelper(testDataBuilder);
    });
    
	describe("Hotel Update Rooms Flow", function() {
        it("Dummy test", function(done) {
			done();
        });
    });
});