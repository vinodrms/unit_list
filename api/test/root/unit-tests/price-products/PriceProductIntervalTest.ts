require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {TestContext} from '../../../helpers/TestContext';
import {ThDateDO, ThMonth} from '../../../../core/utils/th-dates/data-objects/ThDateDO';
import {ThDayInYearIntervalDO} from '../../../../core/utils/th-dates/data-objects/ThDayInYearIntervalDO';
import {ThDateIntervalUtils} from '../../../../core/utils/th-dates/ThDateIntervalUtils';
import {ThDateUtils} from '../../../../core/utils/th-dates/ThDateUtils';

describe("Price Products Interval Tests", function() {
    var testContext: TestContext;
	var thDateUtils: ThDateUtils;

	before(function(done: any) {
		testContext = new TestContext();
		thDateUtils = new ThDateUtils();
		done();
    });

	describe("DayInYear Merge Tests", function() {
        it("Should merge into one interval", function(done) {

			var intervalList: ThDayInYearIntervalDO[] = [
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.January, 22),
					ThDateDO.buildThDateDO(2016, ThMonth.February, 10)
				),
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 10),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 20)
				),
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.March, 13),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 15)
				),
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.March, 5),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 21)
				)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.mergeIntervals();
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 1);

			should.equal(mergedList[0].getStart().day, 22);
			should.equal(mergedList[0].getStart().month, ThMonth.January);
			should.equal(mergedList[0].getStart().year, 2016);
			should.equal(mergedList[0].getEnd().day, 21);
			should.equal(mergedList[0].getEnd().month, ThMonth.March);
			should.equal(mergedList[0].getEnd().year, 2016);

			done();
        });

		it("Should add one interval and merge", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.January, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				),
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.April, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.May, 1)
				)
			];

			var utils = new ThDateIntervalUtils(intervalList);
			utils.addInterval(ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
				ThDateDO.buildThDateDO(2016, ThMonth.March, 2),
				ThDateDO.buildThDateDO(2016, ThMonth.March, 31)
			));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 1);
			should.equal(mergedList[0].getStart().day, 1);
			should.equal(mergedList[0].getStart().month, ThMonth.January);
			should.equal(mergedList[0].getEnd().day, 1);
			should.equal(mergedList[0].getEnd().month, ThMonth.May);

			done();
        });


		it("Should not substract interval", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
				ThDateDO.buildThDateDO(2016, ThMonth.January, 15),
				ThDateDO.buildThDateDO(2016, ThMonth.January, 19)
			));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 1);
			should.equal(mergedList[0].getStart().day, 1);
			should.equal(mergedList[0].getStart().month, ThMonth.February);
			should.equal(mergedList[0].getEnd().day, 1);
			should.equal(mergedList[0].getEnd().month, ThMonth.March);

			done();
        });

		it("Should not substract interval", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
				ThDateDO.buildThDateDO(2016, ThMonth.March, 15),
				ThDateDO.buildThDateDO(2016, ThMonth.March, 19)
			));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 1);
			should.equal(mergedList[0].getStart().day, 1);
			should.equal(mergedList[0].getStart().month, ThMonth.February);
			should.equal(mergedList[0].getEnd().day, 1);
			should.equal(mergedList[0].getEnd().month, ThMonth.March);

			done();
        });

		it("Should substract all active intervals", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
				ThDateDO.buildThDateDO(2016, ThMonth.January, 1),
				ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
			));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 0);

			done();
        });

		it("Should split the interval into two subintervals", function(done) {
			var minDate = thDateUtils.getMinThDateDO();
			var maxDate = thDateUtils.getMaxThDateDO();

			var intervalList: ThDayInYearIntervalDO[] = [
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(minDate, maxDate)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
				ThDateDO.buildThDateDO(2014, ThMonth.January, 1),
				ThDateDO.buildThDateDO(2016, ThMonth.March, 15)
			));

			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 2);
			should.equal(mergedList[0].getStart().day, minDate.day);
			should.equal(mergedList[0].getStart().month, minDate.month);
			should.equal(mergedList[0].getStart().year, minDate.year);
			should.equal(mergedList[0].getEnd().day, 31);
			should.equal(mergedList[0].getEnd().month, ThMonth.December);
			should.equal(mergedList[0].getEnd().year, 2013);

			should.equal(mergedList[1].getStart().day, 16);
			should.equal(mergedList[1].getStart().month, ThMonth.March);
			should.equal(mergedList[1].getStart().year, 2016);
			should.equal(mergedList[1].getEnd().day, maxDate.day);
			should.equal(mergedList[1].getEnd().month, maxDate.month);
			should.equal(mergedList[1].getEnd().year, maxDate.year);

			done();
		});

		it("Should keep a left subinterval", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
				ThDateDO.buildThDateDO(2016, ThMonth.February, 15),
				ThDateDO.buildThDateDO(2016, ThMonth.March, 15)
			));

			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 1);

			should.equal(mergedList[0].getStart().day, 1);
			should.equal(mergedList[0].getStart().month, ThMonth.February);
			should.equal(mergedList[0].getEnd().day, 14);
			should.equal(mergedList[0].getEnd().month, ThMonth.February);

			done();
		});

		it("Should keep a right subinterval", function(done) {
			var intervalList: ThDayInYearIntervalDO[] = [
				ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDayInYearIntervalDO.buildThDayInYearIntervalDO(
				ThDateDO.buildThDateDO(2016, ThMonth.January, 15),
				ThDateDO.buildThDateDO(2016, ThMonth.February, 15)
			));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 1);

			should.equal(mergedList[0].getStart().day, 16);
			should.equal(mergedList[0].getStart().month, ThMonth.February);
			should.equal(mergedList[0].getEnd().day, 1);
			should.equal(mergedList[0].getEnd().month, ThMonth.March);

			done();
		});

    });
});