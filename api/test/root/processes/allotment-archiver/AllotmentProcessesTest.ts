require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {TestContext} from '../../../helpers/TestContext';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestUtils} from '../../../helpers/TestUtils';
import {DefaultAllotmentBuilder} from '../../../db-initializers/builders/DefaultAllotmentBuilder';
import {ThDateUtils} from '../../../../core/utils/th-dates/ThDateUtils';
import {AllotmentArchiverHelper} from './helpers/AllotmentArchiverHelper';
import {AllotmentDO} from '../../../../core/data-layer/allotment/data-objects/AllotmentDO';
import {AllotmentArchiverProcess} from '../../../../core/domain-layer/allotment/processes/AllotmentArchiverProcess';

describe("Allotment Processes Tests", function () {
	var testContext: TestContext;
	var testDataBuilder: DefaultDataBuilder;
	var thDateUtils = new ThDateUtils();
	var testUtils = new TestUtils();

	var allotmentToArchiveList: AllotmentDO[];

	before(function (done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		testDataBuilder.buildWithDoneCallback(done);
    });

	describe("Allotments Archiver Tests", function () {
		it("Should create allotments with the expiration day in the past", function (done) {
			var dataSource = new AllotmentArchiverHelper(testContext, thDateUtils);
			var allotmentBuilder = new DefaultAllotmentBuilder(testContext);
			allotmentBuilder.loadAllotments(dataSource, testDataBuilder.priceProductList, testDataBuilder.customerList).then((createdAllotmentList: AllotmentDO[]) => {
				should.equal(createdAllotmentList.length > 0, true);
				allotmentToArchiveList = createdAllotmentList;
				done();
			}).catch((err: any) => {
				done(err);
			});
        });
		it("Should not archive allotment that did not reach its expiry date yet", function (done) {
			var helper = new AllotmentArchiverHelper(testContext, thDateUtils);
			var timestamp = helper.getTimestampThatShouldNotArchive(testDataBuilder);
			var allotmentsArchiverProcess = new AllotmentArchiverProcess(testContext.appContext, testDataBuilder.hotelDO);
			allotmentsArchiverProcess.archive(timestamp).then((archivedAllotmentList: AllotmentDO[]) => {
				should.equal(archivedAllotmentList.length === 0, true);
				done();
			}).catch((err: any) => {
				done(err);
			});
		});
		it("Should archive allotment that reached its expiry date yet", function (done) {
			var helper = new AllotmentArchiverHelper(testContext, thDateUtils);
			var timestamp = helper.getTimestampThatShouldArchive(testDataBuilder);
			var allotmentsArchiverProcess = new AllotmentArchiverProcess(testContext.appContext, testDataBuilder.hotelDO);
			allotmentsArchiverProcess.archive(timestamp).then((archivedAllotmentList: AllotmentDO[]) => {
				should.equal(archivedAllotmentList.length === allotmentToArchiveList.length, true);
				should.equal(testUtils.stringArraysAreEqual(
					helper.getAllotmentIdList(archivedAllotmentList),
					helper.getAllotmentIdList(allotmentToArchiveList)
				), true);
				done();
			}).catch((err: any) => {
				done(err);
			});
		});
	});
});