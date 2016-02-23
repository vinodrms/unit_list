require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';

import {BedDO, BedSizeDO, BedStatus} from '../../../../core/data-layer/common/data-objects/bed/BedDO';

describe("Beds Tests", function() {
    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
    
    before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
    });
    
    describe("Beds Configuration Flow", function() {
        it("Should get the bed details", function(done) {
			var hotelId = testContext.sessionContext.sessionDO.hotel.id;
            
            var bedDO: BedDO = new BedDO();
            
            testContext.appContext.getRepositoryFactory().getBedRepository().updateBed(bedDO).then((bed: BedDO) => {
                
            }).catch((err: any) => {
                
            });
            
            done();
        });
    });
        
});