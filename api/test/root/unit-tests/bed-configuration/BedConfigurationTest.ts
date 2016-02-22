require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';

describe("Bed Configuration Tests", function() {
    var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
    
    before(function(done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
    });
    
    describe("Bed Configuration Flow", function() {
        it("Should get the hotel details", function(done) {
			done();
        });
    });
        
});