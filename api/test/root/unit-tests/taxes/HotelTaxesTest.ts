require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {HotelTaxesTestHelper} from './helpers/HotelTaxesTestHelper';
import {HotelSaveTaxItem} from '../../../../core/domain-layer/taxes/HotelSaveTaxItem';
import {TaxDO, TaxStatus} from '../../../../core/data-layer/taxes/data-objects/TaxDO';
import {HotelDeleteTaxItem, HotelDeleteTaxItemDO} from '../../../../core/domain-layer/taxes/HotelDeleteTaxItem';
import {TaxResponseRepoDO} from '../../../../core/data-layer/taxes/repositories/ITaxRepository';

describe("Hotel Taxes Tests", function() {
    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var taxesHelper: HotelTaxesTestHelper;

	var createdVatTax: TaxDO;
	var createdOtherTax: TaxDO;
	var numCreatedVatTaxes = 0;
	var numCreatedOtherTaxes = 0;

	before(function(done: any) {
		taxesHelper = new HotelTaxesTestHelper();
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
    });
	describe("Hotel Update Taxes Flow", function() {
        it("Should not create VAT Tax using invalid value type", function(done) {
			var vat = taxesHelper.getVatDOWithInvalidValueType();
			var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			saveTaxItem.save(vat).then((result: TaxDO) => {
				done(new Error("did manage to create a vat tax with invalid value type"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should not create VAT Tax using invalid percentage value", function(done) {
			var vat = taxesHelper.getVatDOWithInvalidValue();
			var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			saveTaxItem.save(vat).then((result: TaxDO) => {
				done(new Error("did manage to create a vat tax with invalid value"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
        });
		it("Should create a new VAT Tax", function(done) {
			var vat = taxesHelper.getValidVatDO();
			var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			saveTaxItem.save(vat).then((result: TaxDO) => {
				should.equal(result.hotelId, testContext.sessionContext.sessionDO.hotel.id);
				should.exist(result.id);
				should.equal(result.name, vat.name);
				should.equal(result.type, vat.type);
				should.equal(result.value, vat.value);
				should.equal(result.valueType, vat.valueType);

				numCreatedVatTaxes++;
				createdVatTax = result;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
		it("Should update the previous VAT", function(done) {
			var vatToUpdate = taxesHelper.getHotelSaveTaxItemDOFrom(createdVatTax);
			vatToUpdate.value = 0.02;

			var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			saveTaxItem.save(vatToUpdate).then((result: TaxDO) => {
				should.equal(result.hotelId, testContext.sessionContext.sessionDO.hotel.id);
				should.exist(result.id);
				should.equal(result.name, vatToUpdate.name);
				should.equal(result.type, vatToUpdate.type);
				should.equal(result.value, vatToUpdate.value);
				should.equal(result.valueType, vatToUpdate.valueType);

				createdVatTax = result;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });

		it("Should create a new other Tax", function(done) {
			var otherTax = taxesHelper.getValidOtherTaxDO();
			var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			saveTaxItem.save(otherTax).then((result: TaxDO) => {
				should.equal(result.hotelId, testContext.sessionContext.sessionDO.hotel.id);
				should.exist(result.id);
				should.equal(result.name, otherTax.name);
				should.equal(result.type, otherTax.type);
				should.equal(result.value, otherTax.value);
				should.equal(result.valueType, otherTax.valueType);

				numCreatedOtherTaxes++;
				createdOtherTax = result;
				done();
			}).catch((e: ThError) => {
				done(e);
			});
        });
    });

	describe("Hotel Get Taxes & Delete Flow", function() {
		it("Should get the previous added taxes", function(done) {
			var taxRepo = testContext.appContext.getRepositoryFactory().getTaxRepository();
			taxRepo.getTaxList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: TaxResponseRepoDO) => {
				should.equal(result.otherTaxList.length, numCreatedOtherTaxes);
				should.equal(result.vatList.length, numCreatedVatTaxes);

				var actualVat = _.find(result.vatList, (tax: TaxDO) => { return tax.id === createdVatTax.id });
				taxesHelper.validate(actualVat, createdVatTax);

				var actualOtherTax = _.find(result.otherTaxList, (tax: TaxDO) => { return tax.id === createdOtherTax.id });
				taxesHelper.validate(actualOtherTax, createdOtherTax);

				done();
			}).catch((err: any) => {
				done(err);
			});
        });
		it("Should delete the added VAT tax", function(done) {
			var deleteTaxItem = new HotelDeleteTaxItem(testContext.appContext, testContext.sessionContext);
			deleteTaxItem.delete({ id: createdVatTax.id }).then((deletedTax: TaxDO) => {
				should.equal(deletedTax.status, TaxStatus.Deleted);
				numCreatedVatTaxes --;
				done();
			}).catch((err: any) => {
				done(err);
			});
        });
		it("Should get only the remaining other tax", function(done) {
			var taxRepo = testContext.appContext.getRepositoryFactory().getTaxRepository();
			taxRepo.getTaxList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: TaxResponseRepoDO) => {
				should.equal(result.otherTaxList.length, numCreatedOtherTaxes);
				should.equal(result.vatList.length, numCreatedVatTaxes);

				var actualOtherTax = _.find(result.otherTaxList, (tax: TaxDO) => { return tax.id === createdOtherTax.id });
				taxesHelper.validate(actualOtherTax, createdOtherTax);

				done();
			}).catch((err: any) => {
				done(err);
			});
        });
	});
});