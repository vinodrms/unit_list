require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {HotelGetDetails} from '../../../../core/domain-layer/hotel-details/get-details/HotelGetDetails';
import {HotelDO} from '../../../../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../../../../core/data-layer/hotel/data-objects/user/UserDO';
import {HotelUpdateBasicInfo} from '../../../../core/domain-layer/hotel-details/basic-info/HotelUpdateBasicInfo';
import {HotelDetailsDO} from '../../../../core/domain-layer/hotel-details/utils/HotelDetailsBuilder';
import {HotelDetailsTestHelper} from './helpers/HotelDetailsTestHelper';

describe("Hotel Details Tests", function() {
    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var hotelDetailstestHelper: HotelDetailsTestHelper;
	before(function(done: any) {
		hotelDetailstestHelper = new HotelDetailsTestHelper();
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
    });
	describe("Hotel Details Flow", function() {
        it("Should get the hotel details", function(done) {
			var hotelDetails = new HotelGetDetails(testContext.appContext, testContext.sessionContext);
			hotelDetails.getDetails().then((details: HotelDetailsDO) => {
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
		it("Should update the hotel basic information", function(done) {
			var basicUpdateDO = hotelDetailstestHelper.getHotelUpdateBasicInfoDO(testDataBuilder.hotelDO);
			var updateBasicInfo = new HotelUpdateBasicInfo(testContext.appContext, testContext.sessionContext, hotelDetailstestHelper.getHotelUpdateBasicInfoDO(testDataBuilder.hotelDO));
			updateBasicInfo.update().then((details: HotelDetailsDO) => {
				should.exist(details.user);
				should.exist(details.hotel);
				should.equal(details.hotel.contactDetails.name, basicUpdateDO.contactDetails.name);
				should.equal(details.hotel.contactDetails.address.city, basicUpdateDO.contactDetails.address.city);
				should.equal(details.hotel.contactDetails.websiteUrl, basicUpdateDO.contactDetails.websiteUrl);
				should.equal(details.hotel.logoUrl, basicUpdateDO.logoUrl);
				done();
			}).catch((e: any) => {
				done(e);
			});
        });
    });


});