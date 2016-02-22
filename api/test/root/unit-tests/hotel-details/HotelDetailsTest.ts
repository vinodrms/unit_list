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
import {HotelAddPaymentsPolicies} from '../../../../core/domain-layer/hotel-details/payment-policies/HotelAddPaymentsPolicies';
import {HotelUpdatePaymentsMethods, HotelUpdatePaymentsMethodsDO} from '../../../../core/domain-layer/hotel-details/payment-policies/HotelUpdatePaymentsMethods';
import {HotelSaveTaxItem} from '../../../../core/domain-layer/hotel-details/payment-policies/HotelSaveTaxItem';
import {TaxDO, TaxType} from '../../../../core/data-layer/common/data-objects/taxes/TaxDO';
import {TaxItemType} from '../../../../core/domain-layer/hotel-details/payment-policies/taxes/TaxItemActionFactory';
import {HotelSaveTaxItemDO} from '../../../../core/domain-layer/hotel-details/payment-policies/HotelSaveTaxItem';
import {OtherTaxItemAddStrategyDO} from '../../../../core/domain-layer/hotel-details/payment-policies/taxes/strategies/OtherTaxItemAddStrategy';
import {OtherTaxItemUpdateStrategyDO} from '../../../../core/domain-layer/hotel-details/payment-policies/taxes/strategies/OtherTaxItemUpdateStrategy';
import {VatTaxItemAddStrategyDO} from '../../../../core/domain-layer/hotel-details/payment-policies/taxes/strategies/VatTaxItemAddStrategy';
import {VatTaxItemUpdateStrategyDO} from '../../../../core/domain-layer/hotel-details/payment-policies/taxes/strategies/VatTaxItemUpdateStrategy';
import {HotelUpdatePropertyDetails} from '../../../../core/domain-layer/hotel-details/property-details/HotelUpdatePropertyDetails';

describe("Hotel Details Tests", function() {
	var FirstVatIndex = 0;
	var InvalidTaxItemType = 99999;
	var InvalidDayHour = 30;

    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var hotelDetailsTestHelper: HotelDetailsTestHelper;
	var testHotelDetailsDO: HotelDetailsDO;

	var testAddedVatItem: TaxDO;
	var testAddedOtherTaxItem: TaxDO;

	before(function(done: any) {
		hotelDetailsTestHelper = new HotelDetailsTestHelper();
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
    });
	describe("Hotel Details Flow", function() {
        it("Should get the hotel details", function(done) {
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
		it("Should update the hotel basic information", function(done) {
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
    });

	describe("Hotel Payments and Policies", function() {
		it("Should not update the hotel payments and policies using invalid currency code", function(done) {
			var paymPoliciesDO = hotelDetailsTestHelper.getHotelAddPaymentsPoliciesDO(testDataBuilder);
			paymPoliciesDO.ccyCode = "XXX";
			var addPaymPolicies = new HotelAddPaymentsPolicies(testContext.appContext, testContext.sessionContext);
			addPaymPolicies.add(paymPoliciesDO).then((details: HotelDetailsDO) => {
				done(new Error("updated payments and policies using wrong currency code"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not update the hotel payments and policies using invalid payment id", function(done) {
			var paymPoliciesDO = hotelDetailsTestHelper.getHotelAddPaymentsPoliciesDO(testDataBuilder);
			paymPoliciesDO.paymentMethodIdList.push("1111111111111");
			var addPaymPolicies = new HotelAddPaymentsPolicies(testContext.appContext, testContext.sessionContext);
			addPaymPolicies.add(paymPoliciesDO).then((details: HotelDetailsDO) => {
				done(new Error("updated payments and policies using invalid payment id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not update the hotel payments and policies using invalid tax", function(done) {
			var paymPoliciesDO = hotelDetailsTestHelper.getHotelAddPaymentsPoliciesDO(testDataBuilder);
			var invalidTax = hotelDetailsTestHelper.getInvalidOtherTaxDO();
			paymPoliciesDO.taxes.otherTaxList.push(invalidTax);
			var addPaymPolicies = new HotelAddPaymentsPolicies(testContext.appContext, testContext.sessionContext);
			addPaymPolicies.add(paymPoliciesDO).then((details: HotelDetailsDO) => {
				done(new Error("updated payments and policies using invalid tax"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should update the hotel payments and policies", function(done) {
			var paymPoliciesDO = hotelDetailsTestHelper.getHotelAddPaymentsPoliciesDO(testDataBuilder);
			var addPaymPolicies = new HotelAddPaymentsPolicies(testContext.appContext, testContext.sessionContext);
			addPaymPolicies.add(paymPoliciesDO).then((details: HotelDetailsDO) => {
				testHotelDetailsDO = details;
				should.equal(details.hotel.ccyCode, paymPoliciesDO.ccyCode);
				should.equal(details.hotel.paymentMethodIdList.length, paymPoliciesDO.paymentMethodIdList.length);
				should.exist(details.hotel.taxes.vatList[FirstVatIndex]);
				should.exist(details.hotel.taxes.vatList[FirstVatIndex].id);
				should.equal(details.hotel.taxes.vatList[FirstVatIndex].name, paymPoliciesDO.taxes.vatList[FirstVatIndex].name);
				should.equal(details.hotel.taxes.vatList[FirstVatIndex].value, paymPoliciesDO.taxes.vatList[FirstVatIndex].value);
				should.exist(details.hotel.taxes.otherTaxList[FirstVatIndex]);
				should.exist(details.hotel.taxes.otherTaxList[FirstVatIndex].id);
				should.equal(details.hotel.taxes.otherTaxList[FirstVatIndex].name, paymPoliciesDO.taxes.otherTaxList[FirstVatIndex].name);
				should.equal(details.hotel.taxes.otherTaxList[FirstVatIndex].value, paymPoliciesDO.taxes.otherTaxList[FirstVatIndex].value);
				should.notEqual(details.hotel.taxes.vatList[FirstVatIndex].id, details.hotel.taxes.otherTaxList[FirstVatIndex].id);
				done();
			}).catch((e: any) => {
				done(e);
			});
        });
    });

	describe("Hotel Payment Methods Only", function() {
		it("Should not update the hotel payment methods using invalid payment method id", function(done) {
			var paymentMethodIdList = hotelDetailsTestHelper.getPaymentMethodIdListFromPaymentMethodList(testDataBuilder.paymentMethodList);
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
			var paymentMethodIdList = hotelDetailsTestHelper.getPaymentMethodIdListFromPaymentMethodList(testDataBuilder.paymentMethodList);
			paymentMethodIdList.splice(0, 1);
			var updtPaymMthdParam: HotelUpdatePaymentsMethodsDO = { paymentMethodIdList: paymentMethodIdList };
			var updtPaymMthd = new HotelUpdatePaymentsMethods(testContext.appContext, testContext.sessionContext, updtPaymMthdParam);
			updtPaymMthd.update().then((details: HotelDetailsDO) => {
				testHotelDetailsDO = details;
				should.exist(details.hotel.paymentMethodIdList);
				should.equal(details.hotel.paymentMethodIdList.length, paymentMethodIdList.length);
				done();
			}).catch((e: any) => {
				done(e);
			});
        });
	});

	describe("Hotel Taxes Flow", function() {
		it("Should not save tax using wrong tax item type", function(done) {
			var vatItem: VatTaxItemAddStrategyDO = {
				value: 0.0,
				name: "Church VAT"
			}
			var invalidTaxItemDO = hotelDetailsTestHelper.getHotelSaveTaxItemDO(InvalidTaxItemType, vatItem);
			var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			saveTaxItem.save(invalidTaxItemDO).then((details: HotelDetailsDO) => {
				done(new Error("managed to save a tax item using wrong TaxItemType"));
			}).catch((e: any) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });

		it("Should add a new vat tax item", function(done) {
			var vatItem: VatTaxItemAddStrategyDO = {
				value: 0.0,
				name: "Church VAT"
			}
			var saveVatTaxItem = hotelDetailsTestHelper.getHotelSaveTaxItemDO(TaxItemType.Vat, vatItem);
			var previousNoOfVatTaxes = testHotelDetailsDO.hotel.taxes.vatList.length;
			var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			saveTaxItem.save(saveVatTaxItem).then((details: HotelDetailsDO) => {
				testHotelDetailsDO = details;
				should.exist(details.hotel.taxes.vatList);
				should.equal(details.hotel.taxes.vatList.length, previousNoOfVatTaxes + 1);
				testAddedVatItem = _.find(details.hotel.taxes.vatList, (tax: TaxDO) => { return tax.name === vatItem.name && tax.value === vatItem.value });
				should.exist(testAddedVatItem);
				should.exist(testAddedVatItem.id);
				should.equal(testAddedVatItem.type, TaxType.Percentage);
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
		it("Should edit the newly added vat tax item", function(done) {
			var vatItem: VatTaxItemUpdateStrategyDO = {
				id: testAddedVatItem.id,
				value: 0.99,
				name: "Updated Church VAT"
			}
			var saveVatTaxItem = hotelDetailsTestHelper.getHotelSaveTaxItemDO(TaxItemType.Vat, vatItem);
			var previousNoOfVatTaxes = testHotelDetailsDO.hotel.taxes.vatList.length;
			var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			saveTaxItem.save(saveVatTaxItem).then((details: HotelDetailsDO) => {
				testHotelDetailsDO = details;
				should.exist(details.hotel.taxes.vatList);
				should.equal(details.hotel.taxes.vatList.length, previousNoOfVatTaxes);
				testAddedVatItem = _.find(details.hotel.taxes.vatList, (tax: TaxDO) => { return tax.id === vatItem.id });
				should.exist(testAddedVatItem);
				should.equal(testAddedVatItem.name, vatItem.name);
				should.equal(testAddedVatItem.value, vatItem.value);
				should.equal(testAddedVatItem.type, TaxType.Percentage);
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });

		it("Should add a new other tax item", function(done) {
			var otherTaxItem: OtherTaxItemAddStrategyDO = {
				type: TaxType.Fixed,
				value: 9999.12134,
				name: "City Night Tax"
			}
			var saveOtherTaxItem = hotelDetailsTestHelper.getHotelSaveTaxItemDO(TaxItemType.OtherTax, otherTaxItem);
			var previousNoOfOtherTaxes = testHotelDetailsDO.hotel.taxes.otherTaxList.length;
			var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			saveTaxItem.save(saveOtherTaxItem).then((details: HotelDetailsDO) => {
				testHotelDetailsDO = details;
				should.exist(details.hotel.taxes.otherTaxList);
				should.equal(details.hotel.taxes.otherTaxList.length, previousNoOfOtherTaxes + 1);
				testAddedOtherTaxItem = _.find(details.hotel.taxes.otherTaxList, (tax: TaxDO) => { return tax.name === otherTaxItem.name && tax.value === otherTaxItem.value && tax.type === otherTaxItem.type });
				should.exist(testAddedOtherTaxItem);
				should.exist(testAddedOtherTaxItem.id);
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
		it("Should edit the newly added other tax item", function(done) {
			var otherTaxItem: OtherTaxItemUpdateStrategyDO = {
				id: testAddedOtherTaxItem.id,
				type: TaxType.Percentage,
				value: 0.99,
				name: "Updated City Night Tax"
			}
			var saveOtherTaxItem = hotelDetailsTestHelper.getHotelSaveTaxItemDO(TaxItemType.OtherTax, otherTaxItem);
			var previousNoOfOtherTaxes = testHotelDetailsDO.hotel.taxes.otherTaxList.length;
			var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			saveTaxItem.save(saveOtherTaxItem).then((details: HotelDetailsDO) => {
				testHotelDetailsDO = details;
				should.exist(details.hotel.taxes.otherTaxList);
				should.equal(details.hotel.taxes.otherTaxList.length, previousNoOfOtherTaxes);
				testAddedOtherTaxItem = _.find(details.hotel.taxes.otherTaxList, (tax: TaxDO) => { return tax.id === otherTaxItem.id });
				should.exist(testAddedOtherTaxItem);
				should.equal(testAddedOtherTaxItem.name, testAddedOtherTaxItem.name);
				should.equal(testAddedOtherTaxItem.value, testAddedOtherTaxItem.value);
				should.equal(testAddedOtherTaxItem.type, testAddedOtherTaxItem.type);
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
	});

	describe("Hotel Property Details Tests", function() {
		it("Should not update the hotel property details using null check in from hour", function(done) {
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
		it("Should not update the hotel property details using invalid check in from hour", function(done) {
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
		it("Should not update the hotel property details using invalid amenity id", function(done) {
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
		it("Should not update the hotel property details using invalid timezone", function(done) {
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
		it("Should update the hotel property details using valid data", function(done) {
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
		it("Should update the hotel property details using valid data containing optional null values", function(done) {
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