require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {BedsTestHelper} from './helpers/BedsTestHelper';

import {BedDO, BedSizeDO, BedStatus} from '../../../../core/data-layer/common/data-objects/bed/BedDO';
import {SaveBedItem} from '../../../../core/domain-layer/beds/SaveBedItem';
import {SaveBedItemDO} from '../../../../core/domain-layer/beds/SaveBedItemDO';

describe("Hotel Beds Tests", function() {
    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
    var bedsHelper: BedsTestHelper;
	var createdBed: BedDO;
	
	var numCreatedBeds = 0;

	before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
        bedsHelper = new BedsTestHelper(testDataBuilder);
    });
    
	describe("Hotel Update Beds Flow", function() {
        it("Should not create invalid bed", function(done) {
			// var vat = taxesHelper.getVatDOWithInvalidValueType();
			// var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			// saveTaxItem.save(vat).then((result: TaxDO) => {
			// 	done(new Error("did manage to create a vat tax with invalid value type"));
			// }).catch((e: ThError) => {
			// 	should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
			// 	done();
			// });
            done();
        });
		it("Should create a new bed item", function(done) {
            var saveBedItemDO: SaveBedItemDO = bedsHelper.getValidSaveBedItemDO();
            var saveBedItem = new SaveBedItem(testContext.appContext, testContext.sessionContext);
            saveBedItem.save(saveBedItemDO).then((result: BedDO) => {
                should.equal(result.hotelId, testContext.sessionContext.sessionDO.hotel.id);
                should.exist(result.id);
                should.equal(result.bedTemplateId, saveBedItemDO.bedTemplateId);
                should.equal(result.name, saveBedItemDO.name);
                should.equal(result.size.widthCm, saveBedItemDO.size.widthCm);
                should.equal(result.size.lengthCm, saveBedItemDO.size.lengthCm);
                should.equal(result.maxNoAdults, saveBedItemDO.maxNoAdults);
                should.equal(result.maxNoChildren, saveBedItemDO.maxNoChildren);
                
                numCreatedBeds++;
                this.createdBed = result;
                
                done();    
            }).catch((e: ThError) => {
                done(e);    
            });
        });
		it("Should update the previously created bed", function(done) {
			var bedToUpdate = bedsHelper.getSaveBedItemDOFrom(this.createdBed);
            bedToUpdate.maxNoAdults = 5;
            
            var saveBedItem = new SaveBedItem(testContext.appContext, testContext.sessionContext);
            saveBedItem.save(bedToUpdate).then((result: BedDO) => {
                should.equal(result.hotelId, testContext.sessionContext.sessionDO.hotel.id);
                should.exist(result.id);
                should.equal(result.bedTemplateId, bedToUpdate.bedTemplateId);
                should.equal(result.name, bedToUpdate.name);
                should.equal(result.size.widthCm, bedToUpdate.size.widthCm);
                should.equal(result.size.lengthCm, bedToUpdate.size.lengthCm);
                should.equal(result.maxNoAdults, bedToUpdate.maxNoAdults);
                should.equal(result.maxNoChildren, bedToUpdate.maxNoChildren);
                
                this.createdBed = result;
                
                done();
            }).catch((e: ThError) => {
                done(e);
            });
        });
		
		it("Should not create a second bed with the same name for the same hotel", function(done) {
			// var otherTax = taxesHelper.getValidOtherTaxDO();
			// var saveTaxItem = new HotelSaveTaxItem(testContext.appContext, testContext.sessionContext);
			// saveTaxItem.save(otherTax).then((result: TaxDO) => {
			// 	done(new Error("did manage to create two taxes with the same name"));
			// }).catch((e: ThError) => {
			// 	should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
			// 	done();
			// });
            done();
        });
    });

	describe("Hotel Get Beds & Delete Flow", function() {
		it("Should get the previously added beds", function(done) {
			// var taxRepo = testContext.appContext.getRepositoryFactory().getTaxRepository();
			// taxRepo.getTaxList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: TaxResponseRepoDO) => {
			// 	should.equal(result.otherTaxList.length, numCreatedOtherTaxes);
			// 	should.equal(result.vatList.length, numCreatedVatTaxes);

			// 	var actualVat = _.find(result.vatList, (tax: TaxDO) => { return tax.id === createdVatTax.id });
			// 	taxesHelper.validate(actualVat, createdVatTax);

			// 	var actualOtherTax = _.find(result.otherTaxList, (tax: TaxDO) => { return tax.id === createdOtherTax.id });
			// 	taxesHelper.validate(actualOtherTax, createdOtherTax);

			// 	done();
			// }).catch((err: any) => {
			// 	done(err);
			// });
            done();
        });
		it("Should delete one of the previously added beds", function(done) {
			// var deleteTaxItem = new HotelDeleteTaxItem(testContext.appContext, testContext.sessionContext);
			// deleteTaxItem.delete({ id: createdVatTax.id }).then((deletedTax: TaxDO) => {
			// 	should.equal(deletedTax.status, TaxStatus.Deleted);
			// 	numCreatedVatTaxes --;
			// 	done();
			// }).catch((err: any) => {
			// 	done(err);
			// });
            done();
        });
		it("Should get only the remaining beds", function(done) {
			// var taxRepo = testContext.appContext.getRepositoryFactory().getTaxRepository();
			// taxRepo.getTaxList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: TaxResponseRepoDO) => {
			// 	should.equal(result.otherTaxList.length, numCreatedOtherTaxes);
			// 	should.equal(result.vatList.length, numCreatedVatTaxes);

			// 	var actualOtherTax = _.find(result.otherTaxList, (tax: TaxDO) => { return tax.id === createdOtherTax.id });
			// 	taxesHelper.validate(actualOtherTax, createdOtherTax);

			// 	done();
			// }).catch((err: any) => {
			// 	done(err);
			// });
            done();
        });
	});
});