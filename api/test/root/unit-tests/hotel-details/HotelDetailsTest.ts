require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

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
import {HotelAddPaymentsPolicies} from '../../../../core/domain-layer/hotel-details/payment-policies/HotelAddPaymentsPolicies';
import {HotelUpdatePaymentsMethods, HotelUpdatePaymentsMethodsDO} from '../../../../core/domain-layer/hotel-details/payment-policies/HotelUpdatePaymentsMethods';

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
			var updateBasicInfo = new HotelUpdateBasicInfo(testContext.appContext, testContext.sessionContext, basicUpdateDO);
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

	describe("Hotel Payments and Policies", function() {
		it("Should not update the hotel payments and policies using invalid currency code", function(done) {
			var paymPoliciesDO = hotelDetailstestHelper.getHotelAddPaymentsPoliciesDO(testDataBuilder);
			paymPoliciesDO.ccyCode = "XXX";
			var addPaymPolicies = new HotelAddPaymentsPolicies(testContext.appContext, testContext.sessionContext, paymPoliciesDO);
			addPaymPolicies.add().then((details: HotelDetailsDO) => {
				done(new Error("updated payments and policies using wrong currency code"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not update the hotel payments and policies using invalid payment id", function(done) {
			var paymPoliciesDO = hotelDetailstestHelper.getHotelAddPaymentsPoliciesDO(testDataBuilder);
			paymPoliciesDO.paymentMethodIdList.push("1111111111111");
			var addPaymPolicies = new HotelAddPaymentsPolicies(testContext.appContext, testContext.sessionContext, paymPoliciesDO);
			addPaymPolicies.add().then((details: HotelDetailsDO) => {
				done(new Error("updated payments and policies using invalid payment id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not update the hotel payments and policies using invalid tax", function(done) {
			var paymPoliciesDO = hotelDetailstestHelper.getHotelAddPaymentsPoliciesDO(testDataBuilder);
			var invalidTax = hotelDetailstestHelper.getInvalidOtherTaxDO();
			paymPoliciesDO.taxes.otherTaxList.push(invalidTax);
			var addPaymPolicies = new HotelAddPaymentsPolicies(testContext.appContext, testContext.sessionContext, paymPoliciesDO);
			addPaymPolicies.add().then((details: HotelDetailsDO) => {
				done(new Error("updated payments and policies using invalid tax"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should update the hotel payments and policies", function(done) {
			var paymPoliciesDO = hotelDetailstestHelper.getHotelAddPaymentsPoliciesDO(testDataBuilder);
			var addPaymPolicies = new HotelAddPaymentsPolicies(testContext.appContext, testContext.sessionContext, paymPoliciesDO);
			addPaymPolicies.add().then((details: HotelDetailsDO) => {
				should.equal(details.hotel.ccyCode, paymPoliciesDO.ccyCode);
				should.equal(details.hotel.paymentMethodIdList.length, paymPoliciesDO.paymentMethodIdList.length);
				should.exist(details.hotel.taxes.vatList[0]);
				should.exist(details.hotel.taxes.vatList[0].id);
				should.equal(details.hotel.taxes.vatList[0].name, paymPoliciesDO.taxes.vatList[0].name);
				should.equal(details.hotel.taxes.vatList[0].value, paymPoliciesDO.taxes.vatList[0].value);
				should.exist(details.hotel.taxes.otherTaxList[0]);
				should.exist(details.hotel.taxes.otherTaxList[0].id);
				should.equal(details.hotel.taxes.otherTaxList[0].name, paymPoliciesDO.taxes.otherTaxList[0].name);
				should.equal(details.hotel.taxes.otherTaxList[0].value, paymPoliciesDO.taxes.otherTaxList[0].value);
				should.notEqual(details.hotel.taxes.vatList[0].id, details.hotel.taxes.otherTaxList[0].id);
				done();
			}).catch((e: any) => {
				done(e);
			});
        });
    });

	describe("Hotel Payment Methods Only", function() {
		it("Should not update the hotel payment methods using invalid payment method id", function(done) {
			var paymentMethodIdList = hotelDetailstestHelper.getPaymentMethodIdListFromPaymentMethodList(testDataBuilder.paymentMethodList);
			paymentMethodIdList.push("1111111111");
			var updtPaymMthdParam: HotelUpdatePaymentsMethodsDO = { paymentMethodIdList: paymentMethodIdList };
			var updtPaymMthd = new HotelUpdatePaymentsMethods(testContext.appContext, testContext.sessionContext, updtPaymMthdParam);
			updtPaymMthd.update().then((details: HotelDetailsDO) => {
				done(new Error("did manage to update payment methods using wrong payment method id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should update the hotel payment methods", function(done) {
			var paymentMethodIdList = hotelDetailstestHelper.getPaymentMethodIdListFromPaymentMethodList(testDataBuilder.paymentMethodList);
			paymentMethodIdList.splice(0, 1);
			var updtPaymMthdParam: HotelUpdatePaymentsMethodsDO = { paymentMethodIdList: paymentMethodIdList };
			var updtPaymMthd = new HotelUpdatePaymentsMethods(testContext.appContext, testContext.sessionContext, updtPaymMthdParam);
			updtPaymMthd.update().then((details: HotelDetailsDO) => {
				should.exist(details.hotel.paymentMethodIdList);
				should.equal(details.hotel.paymentMethodIdList.length, paymentMethodIdList.length);
				done();
			}).catch((e: any) => {
				done(e);
			});
        });
	});


});