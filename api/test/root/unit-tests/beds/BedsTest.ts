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
import {DeleteBedItem} from '../../../../core/domain-layer/beds/DeleteBedItem';
import {SaveBedItemDO} from '../../../../core/domain-layer/beds/SaveBedItemDO';

describe("Hotel Beds Tests", function() {
    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
    var bedsHelper: BedsTestHelper;
	var createdBed: BedDO;
	
	var numCreatedBeds = 2;

	before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
        bedsHelper = new BedsTestHelper(testDataBuilder);
    });
    
	describe("Hotel Update Beds Flow", function() {
        it("Should not create invalid bed", function(done) {
			var bed = bedsHelper.getBedItemDOWithInvalidTemplateId();
			var saveBedItem = new SaveBedItem(testContext.appContext, testContext.sessionContext);
			saveBedItem.save(bed).then((result: BedDO) => {
				done(new Error("did manage to create a bed with invalid bed template id"));
			}).catch((e: ThError) => {
				should.notEqual(e.getThStatusCode(), ThStatusCode.Ok);
				done();
			});
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
                
                createdBed = result;
                
                done();    
            }).catch((e: ThError) => {
                done(e);    
            });
        });
		it("Should update the previously created bed", function(done) {
			var bedToUpdate = bedsHelper.getSaveBedItemDOFrom(createdBed);
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
                
                createdBed = result;
                
                done();
            }).catch((e: ThError) => {
                done(e);
            });
        });
		
		it("Should not create a second bed with the same name for the same hotel", function(done) {
			var newBed = bedsHelper.getValidSaveBedItemDO();
            var saveBedItem = new SaveBedItem(testContext.appContext, testContext.sessionContext);
            
            saveBedItem.save(newBed).then((result: BedDO) => {
                done(new Error("did manage to create two beds with the same name"));    
            }).catch((e: ThError) => {
                should.notEqual(e.getThStatusCode, ThStatusCode.Ok);
                done();    
            });
        });
    });

	describe("Hotel Get Beds & Delete Flow", function() {
		it("Should get the previously added beds", function(done) {
			var bedRepo = testContext.appContext.getRepositoryFactory().getBedRepository();
			bedRepo.getBedList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: BedDO[]) => {
				should.equal(result.length, numCreatedBeds);

				var readBed = _.find(result, (bed: BedDO) => { return bed.id === createdBed.id });
				
                bedsHelper.validate(readBed, createdBed);

				done();
			}).catch((err: any) => {
				done(err);
			});
        });
		it("Should delete one of the previously added beds", function(done) {
			var deleteBedItem = new DeleteBedItem(testContext.appContext, testContext.sessionContext);
			deleteBedItem.delete({ id: createdBed.id }).then((deletedBed: BedDO) => {
				should.equal(deletedBed.status, BedStatus.Deleted);
				numCreatedBeds--;
				done();
			}).catch((err: any) => {
				done(err);
			});
        });
		it("Should get only the remaining beds", function(done) {
			var bedRepo = testContext.appContext.getRepositoryFactory().getBedRepository();
            
            bedRepo.getBedList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: BedDO[]) => {
				should.equal(result.length, numCreatedBeds);
				done();
			}).catch((err: any) => {
				done(err);
			});
        });
	});
});