require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import { ThError } from '../../../../core/utils/th-responses/ThError';
import { ThStatusCode } from '../../../../core/utils/th-responses/ThResponse';
import { TestUtils } from '../../../../test/helpers/TestUtils';
import { DefaultDataBuilder } from '../../../db-initializers/DefaultDataBuilder';
import { TestContext } from '../../../helpers/TestContext';
import { ReportMetadataDO } from '../../../../core/data-layer/reports/data-objects/ReportMetadataDO';
import {expectedReportsMetadataList} from './ExpectedReportsMetadata'

describe("Hotel Rooms Tests", function () {
    var testUtils: TestUtils;
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;

    before(function (done: any) {
        testUtils = new TestUtils();
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        testDataBuilder.buildWithDoneCallback(done);
    });

    describe("Hotel Update Rooms Flow", function () {
        it("Should return the reports list metadata", function (done) {
            var reportsRepository = testContext.appContext.getRepositoryFactory().getReportsMetadataRepository();
            reportsRepository.getAllReportMetadata().then(results => {
                let actualResult = JSON.stringify(results);
                let expectedResult = JSON.stringify(expectedReportsMetadataList);
                should.equal(actualResult, expectedResult);
                done();
            })
        });

        it("Should not create room with invalid amenities", function (done) {
        });
    });
});