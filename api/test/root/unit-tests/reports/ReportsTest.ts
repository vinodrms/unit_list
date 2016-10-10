require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import { ThError } from '../../../../core/utils/th-responses/ThError';
import { ThStatusCode } from '../../../../core/utils/th-responses/ThResponse';
import { TestUtils } from '../../../../test/helpers/TestUtils';
import { DefaultDataBuilder } from '../../../db-initializers/DefaultDataBuilder';
import { TestContext } from '../../../helpers/TestContext';
import { ReportMetadataDO, ReportType } from '../../../../core/data-layer/reports/data-objects/ReportMetadataDO';
import { ReportDO } from '../../../../core/data-layer/reports/data-objects/ReportDO';
import { ReportGeneratorFactory } from '../../../../core/domain-layer/reports/ReportGeneratorFactory';
import { ExpectedReports } from './ExpectedReports';

import _ = require('underscore');

describe("Reports", function () {
	var testUtils: TestUtils;
	var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;

	before(function (done: any) {
		testUtils = new TestUtils();
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
	});

	describe("Reports", function () {
		it("Should return the reports list metadata", function (done) {
			var reportsRepository = testContext.appContext.getRepositoryFactory().getReportsMetadataRepository();
			reportsRepository.getAllReportMetadata().then(results => {
				let actualResult = JSON.stringify(results);
				let expectedResult = JSON.stringify(ExpectedReports.reportsMetadataList);
				should.equal(actualResult, expectedResult);
				done();
			}).catch((error: ThError) => {
				done(error);
			})
		});
	});

	describe("Report Guest Arrival", function () {
		it("Should generate report", function (done) {
			const reportType = ReportType.GuestsArriving;
			const params = {};

			let reportsMetadataRepository = testContext.appContext.getRepositoryFactory().getReportsMetadataRepository();
			let reportGeneratorFactory = new ReportGeneratorFactory(testContext.appContext);

			let reportGeneratorStrategy = reportGeneratorFactory.getGeneratorStrategy(reportType);
			reportGeneratorStrategy.generate(params).then((results: ReportDO) => {
				let expetedReport = ExpectedReports.reports.GuestArrivalsReport;
				let actualResult = JSON.stringify(results);
				let expectedResult = JSON.stringify(expetedReport);
				should.equal(actualResult, expectedResult);
				done();
			}).catch((error: ThError) => {
				done(error);
			});
		});
	});
});