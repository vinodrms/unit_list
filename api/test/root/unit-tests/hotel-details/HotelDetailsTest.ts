require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {HotelGetDetails} from '../../../../core/domain-layer/hotel-details/get-details/HotelGetDetails';
import {HotelDO} from '../../../../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../../../../core/data-layer/hotel/data-objects/user/UserDO';

describe("Hotel Details Tests", function() {
    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
    });

	describe("Check Hotel Details Flow", function() {
        it("Should get the hotel details", function(done) {
			var hotelDetails = new HotelGetDetails(testContext.appContext, testContext.sessionContext);
			hotelDetails.getDetails().then((details: { user: UserDO, hotel: HotelDO }) => {
				should.exist(details.hotel);
				should.exist(details.user);
				should.exist(details.hotel.versionId);
				should.equal(details.hotel.contactDetails.name, testDataBuilder.hotelDO.contactDetails.name);
				should.equal(details.user.contactDetails.firstName, testDataBuilder.userDO.contactDetails.firstName);
				should.equal(details.user.contactDetails.lastName, testDataBuilder.userDO.contactDetails.lastName);
				done();
			}).catch((e: any) => {
				done(e);
			});
        });

    });


});