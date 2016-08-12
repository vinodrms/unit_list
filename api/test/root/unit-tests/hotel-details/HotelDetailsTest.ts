require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {HotelGetDetails} from '../../../../core/domain-layer/hotel-details/get-details/HotelGetDetails';
import {HotelDO} from '../../../../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../../../../core/data-layer/hotel/data-objects/user/UserDO';
import {HotelUpdateBasicInfo} from '../../../../core/domain-layer/hotel-details/basic-info/HotelUpdateBasicInfo';
import {HotelDetailsDO} from '../../../../core/domain-layer/hotel-details/utils/HotelDetailsBuilder';
import {HotelDetailsTestHelper} from './helpers/HotelDetailsTestHelper';
import {HotelUpdatePaymentsPolicies} from '../../../../core/domain-layer/hotel-details/payment-policies/HotelUpdatePaymentsPolicies';
import {HotelUpdatePropertyDetails} from '../../../../core/domain-layer/hotel-details/property-details/HotelUpdatePropertyDetails';
import {HotelConfigurations} from '../../../../core/domain-layer/hotel-details/config-completed/HotelConfigurations';

describe("Hotel Details Tests", function () {
	var InvalidDayHour = 30;

    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var hotelDetailsTestHelper: HotelDetailsTestHelper;
	var testHotelDetailsDO: HotelDetailsDO;

	before(function (done: any) {
		hotelDetailsTestHelper = new HotelDetailsTestHelper();
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
    });
	describe("Hotel Details Flow", function () {
        it("Should get the hotel details", function (done) {
			var hotelDetails = new HotelGetDetails(testContext.appContext, testContext.sessionContext);
			hotelDetails.getDetails().then((details: HotelDetailsDO) => {
				testHotelDetailsDO = details;
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
		it("Should update the hotel basic information", function (done) {
			var basicUpdateDO = hotelDetailsTestHelper.getHotelUpdateBasicInfoDO(testDataBuilder.hotelDO);
			var updateBasicInfo = new HotelUpdateBasicInfo(testContext.appContext, testContext.sessionContext, basicUpdateDO);
			updateBasicInfo.update().then((details: HotelDetailsDO) => {
				testHotelDetailsDO = details;
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
		it("Should mark the hotel's configurationCompleted as true", function (done) {
			var hotelConfigurationStatus = new HotelConfigurations(testContext.appContext, testContext.sessionContext);
			hotelConfigurationStatus.markAsCompleted().then((updatedHotel: HotelDO) => {
				should.equal(updatedHotel.configurationCompleted, true);
				should.exist(updatedHotel.configurationCompletedTimestamp);
				done();
			}).catch((e: any) => {
				done(e);
			});
        });
    });

	describe("Hotel Payments and Policies", function () {
		it("Should not update the hotel payments and policies using invalid currency code", function (done) {
			var paymPoliciesDO = hotelDetailsTestHelper.getHotelUpdatePaymentsPoliciesDO(testDataBuilder);
			paymPoliciesDO.ccyCode = "XXX";
			var updatePaymPolicies = new HotelUpdatePaymentsPolicies(testContext.appContext, testContext.sessionContext);
			updatePaymPolicies.update(paymPoliciesDO).then((details: HotelDetailsDO) => {
				done(new Error("updated payments and policies using wrong currency code"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not update the hotel payments and policies using invalid payment id", function (done) {
			var paymPoliciesDO = hotelDetailsTestHelper.getHotelUpdatePaymentsPoliciesDO(testDataBuilder);
			paymPoliciesDO.paymentMethodIdList.push("1111111111111");
			var updatePaymPolicies = new HotelUpdatePaymentsPolicies(testContext.appContext, testContext.sessionContext);
			updatePaymPolicies.update(paymPoliciesDO).then((details: HotelDetailsDO) => {
				done(new Error("updated payments and policies using invalid payment id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should update the hotel payments and policies", function (done) {
			var paymPoliciesDO = hotelDetailsTestHelper.getHotelUpdatePaymentsPoliciesDO(testDataBuilder);
			var updatePaymPolicies = new HotelUpdatePaymentsPolicies(testContext.appContext, testContext.sessionContext);
			updatePaymPolicies.update(paymPoliciesDO).then((details: HotelDetailsDO) => {
				testHotelDetailsDO = details;
				should.equal(details.hotel.ccyCode, paymPoliciesDO.ccyCode);
				should.equal(details.hotel.paymentMethodIdList.length, paymPoliciesDO.paymentMethodIdList.length);
				done();
			}).catch((e: any) => {
				done(e);
			});
        });
    });

	describe("Hotel Property Details Tests", function () {
		it("Should not update the hotel property details using null check in from hour", function (done) {
			var propertyDetails = hotelDetailsTestHelper.getHotelUpdatePropertyDetailsDO(testDataBuilder);
			propertyDetails.operationHours.checkInFrom.hour = null;
			var updtPropertyDetails = new HotelUpdatePropertyDetails(testContext.appContext, testContext.sessionContext, propertyDetails);
			updtPropertyDetails.update().then((details: HotelDetailsDO) => {
				done(new Error("did manage to update property details using null check in from hour"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not update the hotel property details using invalid check in from hour", function (done) {
			var propertyDetails = hotelDetailsTestHelper.getHotelUpdatePropertyDetailsDO(testDataBuilder);
			propertyDetails.operationHours.checkInFrom.hour = InvalidDayHour;
			var updtPropertyDetails = new HotelUpdatePropertyDetails(testContext.appContext, testContext.sessionContext, propertyDetails);
			updtPropertyDetails.update().then((details: HotelDetailsDO) => {
				done(new Error("did manage to update property details using invalid check in from hour"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not update the hotel property details using invalid amenity id", function (done) {
			var propertyDetails = hotelDetailsTestHelper.getHotelUpdatePropertyDetailsDO(testDataBuilder);
			propertyDetails.amenityIdList.push("1111111111");
			var updtPropertyDetails = new HotelUpdatePropertyDetails(testContext.appContext, testContext.sessionContext, propertyDetails);
			updtPropertyDetails.update().then((details: HotelDetailsDO) => {
				done(new Error("did manage to update property details using invalid amenity id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not update the hotel property details using invalid timezone", function (done) {
			var propertyDetails = hotelDetailsTestHelper.getHotelUpdatePropertyDetailsDO(testDataBuilder);
			propertyDetails.timezone = "BukaresTimezone";
			var updtPropertyDetails = new HotelUpdatePropertyDetails(testContext.appContext, testContext.sessionContext, propertyDetails);
			updtPropertyDetails.update().then((details: HotelDetailsDO) => {
				done(new Error("did manage to update property details using invalid timezone"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should update the hotel property details using valid data", function (done) {
			var propertyDetails = hotelDetailsTestHelper.getHotelUpdatePropertyDetailsDO(testDataBuilder);
			var updtPropertyDetails = new HotelUpdatePropertyDetails(testContext.appContext, testContext.sessionContext, propertyDetails);
			updtPropertyDetails.update().then((details: HotelDetailsDO) => {
				should.equal(details.hotel.timezone, propertyDetails.timezone);
				should.equal(details.hotel.amenityIdList.length, propertyDetails.amenityIdList.length);
				should.equal(details.hotel.operationHours.checkInFrom.hour, propertyDetails.operationHours.checkInFrom.hour);
				should.equal(details.hotel.operationHours.checkInFrom.minute, propertyDetails.operationHours.checkInFrom.minute);
				should.equal(details.hotel.operationHours.checkInToOptional.hour, propertyDetails.operationHours.checkInToOptional.hour);
				should.equal(details.hotel.operationHours.checkInToOptional.minute, propertyDetails.operationHours.checkInToOptional.minute);
				should.equal(details.hotel.operationHours.checkOutFromOptional.hour, propertyDetails.operationHours.checkOutFromOptional.hour);
				should.equal(details.hotel.operationHours.checkOutFromOptional.minute, propertyDetails.operationHours.checkOutFromOptional.minute);
				should.equal(details.hotel.operationHours.checkOutTo.hour, propertyDetails.operationHours.checkOutTo.hour);
				should.equal(details.hotel.operationHours.checkOutTo.minute, propertyDetails.operationHours.checkOutTo.minute);
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
		it("Should update the hotel property details using valid data containing optional null values", function (done) {
			var propertyDetails = hotelDetailsTestHelper.getHotelUpdatePropertyDetailsDO(testDataBuilder);
			propertyDetails.operationHours.checkInToOptional.hour = null;
			propertyDetails.operationHours.checkInToOptional.minute = null;
			propertyDetails.operationHours.checkOutFromOptional.hour = null;
			propertyDetails.operationHours.checkOutFromOptional.minute = null;
			var updtPropertyDetails = new HotelUpdatePropertyDetails(testContext.appContext, testContext.sessionContext, propertyDetails);
			updtPropertyDetails.update().then((details: HotelDetailsDO) => {
				should.equal(details.hotel.timezone, propertyDetails.timezone);
				should.equal(details.hotel.amenityIdList.length, propertyDetails.amenityIdList.length);
				should.equal(details.hotel.operationHours.checkInFrom.hour, propertyDetails.operationHours.checkInFrom.hour);
				should.equal(details.hotel.operationHours.checkInFrom.minute, propertyDetails.operationHours.checkInFrom.minute);
				should.equal(details.hotel.operationHours.checkInToOptional.hour, propertyDetails.operationHours.checkInToOptional.hour);
				should.equal(details.hotel.operationHours.checkInToOptional.minute, propertyDetails.operationHours.checkInToOptional.minute);
				should.equal(details.hotel.operationHours.checkOutFromOptional.hour, propertyDetails.operationHours.checkOutFromOptional.hour);
				should.equal(details.hotel.operationHours.checkOutFromOptional.minute, propertyDetails.operationHours.checkOutFromOptional.minute);
				should.equal(details.hotel.operationHours.checkOutTo.hour, propertyDetails.operationHours.checkOutTo.hour);
				should.equal(details.hotel.operationHours.checkOutTo.minute, propertyDetails.operationHours.checkOutTo.minute);
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
	});
});