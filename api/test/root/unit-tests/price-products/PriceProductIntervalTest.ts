require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {TestContext} from '../../../helpers/TestContext';
import {ThDayInYearDO} from '../../../../core/utils/th-dates/data-objects/ThDayInYearDO';
import {ThDayInYearIntervalDO} from '../../../../core/utils/th-dates/data-objects/ThDayInYearIntervalDO';
import {ThDayInYearIntervalUtils} from '../../../../core/utils/th-dates/ThDayInYearIntervalUtils';

function buildThDayInYearDO(day: number, month: number): ThDayInYearDO {
	var dayInYear = new ThDayInYearDO();
	dayInYear.day = day;
	dayInYear.month = month;
	return dayInYear;
}
function buildThDayInYearIntervalDO(startDay: number, startMonth: number, endDay: number, endMonth: number): ThDayInYearIntervalDO {
	var interval = new ThDayInYearIntervalDO();
	interval.start = buildThDayInYearDO(startDay, startMonth);
	interval.end = buildThDayInYearDO(endDay, endMonth);
	return interval;
}

describe("Price Products Interval Tests", function() {
    var testContext: TestContext;

	before(function(done: any) {
		testContext = new TestContext();
		done();
    });

	describe("DayInYear Merge Tests", function() {
        it("Should merge into one interval", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				buildThDayInYearIntervalDO(13, 3, 15, 3),
				buildThDayInYearIntervalDO(5, 3, 21, 3),
				buildThDayInYearIntervalDO(22, 1, 10, 2),
				buildThDayInYearIntervalDO(10, 2, 20, 3),
				buildThDayInYearIntervalDO(15, 9, 19, 10)
			];
			var utils = new ThDayInYearIntervalUtils(intervalList);
			utils.mergeIntervals();
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 2);

			should.equal(mergedList[0].getStart().day, 22);
			should.equal(mergedList[0].getStart().month, 1);
			should.equal(mergedList[0].getEnd().day, 21);
			should.equal(mergedList[0].getEnd().month, 3);

			should.equal(mergedList[1].getStart().day, 15);
			should.equal(mergedList[1].getStart().month, 9);
			should.equal(mergedList[1].getEnd().day, 19);
			should.equal(mergedList[1].getEnd().month, 10);

			done();
        });

		it("Should add one interval", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				buildThDayInYearIntervalDO(1, 1, 1, 3),
				buildThDayInYearIntervalDO(1, 4, 1, 5)
			];
			var utils = new ThDayInYearIntervalUtils(intervalList);
			utils.addInterval(buildThDayInYearIntervalDO(2, 3, 31, 3))
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 1);
			should.equal(mergedList[0].getStart().day, 1);
			should.equal(mergedList[0].getStart().month, 1);
			should.equal(mergedList[0].getEnd().day, 1);
			should.equal(mergedList[0].getEnd().month, 5);

			done();
        });

		it("Should not substract interval", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				buildThDayInYearIntervalDO(1, 2, 1, 3)
			];
			var utils = new ThDayInYearIntervalUtils(intervalList);
			utils.removeInterval(buildThDayInYearIntervalDO(15, 1, 19, 1));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 1);
			should.equal(mergedList[0].getStart().day, 1);
			should.equal(mergedList[0].getStart().month, 2);
			should.equal(mergedList[0].getEnd().day, 1);
			should.equal(mergedList[0].getEnd().month, 3);

			done();
        });

		it("Should not substract interval", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				buildThDayInYearIntervalDO(1, 2, 1, 3)
			];
			var utils = new ThDayInYearIntervalUtils(intervalList);
			utils.removeInterval(buildThDayInYearIntervalDO(15, 3, 19, 3));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 1);
			should.equal(mergedList[0].getStart().day, 1);
			should.equal(mergedList[0].getStart().month, 2);
			should.equal(mergedList[0].getEnd().day, 1);
			should.equal(mergedList[0].getEnd().month, 3);

			done();
        });

		it("Should substract all active intervals", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				buildThDayInYearIntervalDO(1, 2, 1, 3)
			];
			var utils = new ThDayInYearIntervalUtils(intervalList);
			utils.removeInterval(buildThDayInYearIntervalDO(15, 1, 1, 3));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 0);

			done();
        });

		it("Should split the interval into two subintervals", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				buildThDayInYearIntervalDO(1, 2, 1, 3)
			];
			var utils = new ThDayInYearIntervalUtils(intervalList);
			utils.removeInterval(buildThDayInYearIntervalDO(15, 2, 15, 2));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 2);
			should.equal(mergedList[0].getStart().day, 1);
			should.equal(mergedList[0].getStart().month, 2);
			should.equal(mergedList[0].getEnd().day, 14);
			should.equal(mergedList[0].getEnd().month, 2);

			should.equal(mergedList[1].getStart().day, 16);
			should.equal(mergedList[1].getStart().month, 2);
			should.equal(mergedList[1].getEnd().day, 1);
			should.equal(mergedList[1].getEnd().month, 3);

			done();
        });

		it("Should keep a left subinterval", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				buildThDayInYearIntervalDO(1, 2, 1, 3)
			];
			var utils = new ThDayInYearIntervalUtils(intervalList);
			utils.removeInterval(buildThDayInYearIntervalDO(15, 2, 15, 3));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 1);

			should.equal(mergedList[0].getStart().day, 1);
			should.equal(mergedList[0].getStart().month, 2);
			should.equal(mergedList[0].getEnd().day, 14);
			should.equal(mergedList[0].getEnd().month, 2);

			done();
        });

		it("Should keep a right subinterval", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				buildThDayInYearIntervalDO(1, 2, 1, 3)
			];
			var utils = new ThDayInYearIntervalUtils(intervalList);
			utils.removeInterval(buildThDayInYearIntervalDO(15, 1, 15, 2));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 1);

			should.equal(mergedList[0].getStart().day, 16);
			should.equal(mergedList[0].getStart().month, 2);
			should.equal(mergedList[0].getEnd().day, 1);
			should.equal(mergedList[0].getEnd().month, 3);

			done();
        });

    });
});