require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");
import async = require("async");

import { TestContext } from '../../../helpers/TestContext';
import { DefaultDataBuilder } from '../../../db-initializers/DefaultDataBuilder';
import { ThDateDO, ThMonth } from '../../../../core/utils/th-dates/data-objects/ThDateDO';
import { ThTimestampDO } from '../../../../core/utils/th-dates/data-objects/ThTimestampDO';
import { ThDateIntervalDO } from '../../../../core/utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateIntervalUtils } from '../../../../core/utils/th-dates/ThDateIntervalUtils';
import { ThDateUtils } from '../../../../core/utils/th-dates/ThDateUtils';
import { PriceProductDO } from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductYielding } from '../../../../core/domain-layer/yield-manager/price-product-yielding/PriceProductYielding';
import { PriceProductYieldingDO, PriceProductYieldAction } from '../../../../core/domain-layer/yield-manager/price-product-yielding/PriceProductYieldingDO';
import { PriceProductReader } from '../../../../core/domain-layer/yield-manager/price-product-reader/PriceProductReader';
import { YieldManagerPeriodDO } from '../../../../core/domain-layer/yield-manager/utils/YieldManagerPeriodDO';
import { PriceProductYieldResult, PriceProductYieldItem, YieldItemStateType, YieldItemState } from '../../../../core/domain-layer/yield-manager/price-product-reader/utils/PriceProductYieldItem';
import { HotelInventorySnapshotProcess, InventorySnapshotProcessResult, InventorySnapshotType } from '../../../../core/domain-layer/hotel-inventory-snapshots/processes/HotelInventorySnapshotProcess';
import { HotelInventorySnapshotDO } from '../../../../core/data-layer/hotel-inventory-snapshots/data-objects/HotelInventorySnapshotDO';
import { KeyMetricReader } from '../../../../core/domain-layer/yield-manager/key-metrics/KeyMetricReader';
import { KeyMetricsResult, KeyMetric } from '../../../../core/domain-layer/yield-manager/key-metrics/utils/KeyMetricsResult';
import { DynamicPriceYielding } from "../../../../core/domain-layer/yield-manager/dynamic-price-yielding/DynamicPriceYielding";
import { DynamicPriceYieldingDO } from "../../../../core/domain-layer/yield-manager/dynamic-price-yielding/DynamicPriceYieldingDO";
import { KeyMetricsReaderInputBuilder } from "../../../../core/domain-layer/yield-manager/key-metrics/utils/KeyMetricsReaderInputBuilder";
import { KeyMetricOutputType } from "../../../../core/domain-layer/yield-manager/key-metrics/utils/builder/MetricBuilderStrategyFactory";

function testPriceProductOpenInterval(priceProduct: PriceProductDO, firstIntervalEnd: ThDateDO, secondIntervalStart: ThDateDO) {
	should.equal(priceProduct.openIntervalList.length >= 2, true);
	should.equal(priceProduct.openIntervalList[0].getEnd().day, firstIntervalEnd.day);
	should.equal(priceProduct.openIntervalList[0].getEnd().month, firstIntervalEnd.month);
	should.equal(priceProduct.openIntervalList[0].getEnd().year, firstIntervalEnd.year);
	should.equal(priceProduct.openIntervalList[1].getStart().day, secondIntervalStart.day);
	should.equal(priceProduct.openIntervalList[1].getStart().month, secondIntervalStart.month);
	should.equal(priceProduct.openIntervalList[1].getStart().year, secondIntervalStart.year);
}

describe("Price Products Interval Tests", function () {
	var testContext: TestContext;
	var thDateUtils: ThDateUtils;
	var testDataBuilder: DefaultDataBuilder;

	var createdSnapshot: HotelInventorySnapshotDO;
	var StressTestIterations = 50;

	before(function (done: any) {
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		thDateUtils = new ThDateUtils();
		testDataBuilder.buildWithDoneCallback(done);
	});

	describe("DayInYear Merge Tests", function () {
		it("Should merge into one interval", function (done) {

			var intervalList: ThDateIntervalDO[] = [
				ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.January, 22),
					ThDateDO.buildThDateDO(2016, ThMonth.February, 10)
				),
				ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 10),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 20)
				),
				ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.March, 13),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 15)
				),
				ThDateIntervalDO.buildThDateIntervalDO(
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

		it("Should add one interval and merge", function (done) {
			var intervalList: ThDateIntervalDO[] = [
				ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.January, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				),
				ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.April, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.May, 1)
				)
			];

			var utils = new ThDateIntervalUtils(intervalList);
			utils.addInterval(ThDateIntervalDO.buildThDateIntervalDO(
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


		it("Should not substract interval", function (done) {
			var intervalList: ThDateIntervalDO[] = [
				ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDateIntervalDO.buildThDateIntervalDO(
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

		it("Should not substract interval", function (done) {
			var intervalList: ThDateIntervalDO[] = [
				ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDateIntervalDO.buildThDateIntervalDO(
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

		it("Should substract all active intervals", function (done) {
			var intervalList: ThDateIntervalDO[] = [
				ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDateIntervalDO.buildThDateIntervalDO(
				ThDateDO.buildThDateDO(2016, ThMonth.January, 1),
				ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
			));
			var mergedList = utils.getProcessedIntervals();

			should.equal(mergedList.length, 0);

			done();
		});

		it("Should split the interval into two subintervals", function (done) {
			var minDate = thDateUtils.getMinThDateDO();
			var maxDate = thDateUtils.getMaxThDateDO();

			var intervalList: ThDateIntervalDO[] = [
				ThDateIntervalDO.buildThDateIntervalDO(minDate, maxDate)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDateIntervalDO.buildThDateIntervalDO(
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

		it("Should keep a left subinterval", function (done) {
			var intervalList: ThDateIntervalDO[] = [
				ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDateIntervalDO.buildThDateIntervalDO(
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

		it("Should keep a right subinterval", function (done) {
			var intervalList: ThDateIntervalDO[] = [
				ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.February, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.March, 1)
				)
			];
			var utils = new ThDateIntervalUtils(intervalList);
			utils.removeInterval(ThDateIntervalDO.buildThDateIntervalDO(
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

	describe("Yield Management Tests", function () {
		it("Should close price products from 1 Jan to 1 Jan (only one day)", function (done) {
			var yieldData: PriceProductYieldingDO = {
				priceProductIdList: _.map(testDataBuilder.priceProductList, (priceProduct: PriceProductDO) => { return priceProduct.id }),
				action: PriceProductYieldAction.Close,
				forever: false,
				interval: ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.January, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.January, 1)
				)
			};
			var ppYm = new PriceProductYielding(testContext.appContext, testContext.sessionContext);
			ppYm.yield(yieldData).then((yieldedPriceProducts: PriceProductDO[]) => {
				yieldedPriceProducts.forEach((priceProduct: PriceProductDO) => {
					testPriceProductOpenInterval(priceProduct, ThDateDO.buildThDateDO(2015, ThMonth.December, 31), ThDateDO.buildThDateDO(2016, ThMonth.January, 2));
				});
				done();
			}).catch((error: any) => {
				done(error);
			});
		});
		it("Should close for arrival price products forever", function (done) {
			var yieldData: PriceProductYieldingDO = <any>{
				priceProductIdList: _.map(testDataBuilder.priceProductList, (priceProduct: PriceProductDO) => { return priceProduct.id }),
				action: PriceProductYieldAction.CloseForArrival,
				forever: true
			};
			var ppYm = new PriceProductYielding(testContext.appContext, testContext.sessionContext);
			ppYm.yield(yieldData).then((yieldedPriceProducts: PriceProductDO[]) => {
				yieldedPriceProducts.forEach((priceProduct: PriceProductDO) => {
					should.equal(priceProduct.openForArrivalIntervalList.length, 0);
				});
				done();
			}).catch((error: any) => {
				done(error);
			});
		});
		it("Should read the Yielded values of the Price Products", function (done) {
			var yieldPeriodDO = new YieldManagerPeriodDO();
			yieldPeriodDO.referenceDate = ThDateDO.buildThDateDO(2015, ThMonth.December, 31);
			yieldPeriodDO.noDays = 3;

			var ppReader = new PriceProductReader(testContext.appContext, testContext.sessionContext);
			ppReader.getYieldItems(yieldPeriodDO).then((yieldResult: PriceProductYieldResult) => {
				should.equal(yieldResult.dateList.length, 3);
				_.forEach(testDataBuilder.priceProductList, (priceProduct: PriceProductDO) => {
					var yieldItem: PriceProductYieldItem = _.find(yieldResult.itemList, (item: PriceProductYieldItem) => { return item.priceProductId === priceProduct.id });
					should.exist(yieldItem);
					should.equal(yieldItem.priceProductName, priceProduct.name);
					should.equal(yieldItem.lastRoomAvailability, priceProduct.lastRoomAvailability);
					should.equal(yieldItem.stateList.length, 3);

					should.equal(yieldItem.stateList[0].open, YieldItemStateType.Open);
					should.equal(yieldItem.stateList[1].open, YieldItemStateType.Closed);
					should.equal(yieldItem.stateList[2].open, YieldItemStateType.Open);

					should.equal(yieldItem.stateList[0].openForArrival, YieldItemStateType.Closed);
					should.equal(yieldItem.stateList[1].openForArrival, YieldItemStateType.Closed);
					should.equal(yieldItem.stateList[2].openForArrival, YieldItemStateType.Closed);

					should.equal(yieldItem.stateList[0].openForDeparture, YieldItemStateType.Open);
					should.equal(yieldItem.stateList[1].openForDeparture, YieldItemStateType.Open);
					should.equal(yieldItem.stateList[2].openForDeparture, YieldItemStateType.Open);

					should.equal(yieldItem.dynamicPriceList.length >= 1, true);
					yieldItem.dynamicPriceList.forEach((dynamicPrice, index) => {
						should.equal(dynamicPrice.openList.length, 3);
						should.equal(dynamicPrice.dynamicPriceId.length > 1, true);
						should.equal(dynamicPrice.name.length > 1, true);
						should.equal(dynamicPrice.priceBriefString.length > 1, true);
						should.equal(dynamicPrice.roomCategoryNameForPriceBrief.length > 1, true);
						dynamicPrice.openList.forEach(open => {
							if (index == 0) {
								should.equal(open, YieldItemStateType.Open);
							}
							else {
								should.equal(open, YieldItemStateType.Closed);
							}
						});
					});
				});
				done();
			}).catch((error: any) => {
				done(error);
			});
		});
		it("Should open the price products on the previously closed day", function (done) {
			var yieldData: PriceProductYieldingDO = {
				priceProductIdList: _.map(testDataBuilder.priceProductList, (priceProduct: PriceProductDO) => { return priceProduct.id }),
				action: PriceProductYieldAction.Open,
				forever: false,
				interval: ThDateIntervalDO.buildThDateIntervalDO(
					ThDateDO.buildThDateDO(2016, ThMonth.January, 1),
					ThDateDO.buildThDateDO(2016, ThMonth.January, 1)
				)
			};
			var ppYm = new PriceProductYielding(testContext.appContext, testContext.sessionContext);
			ppYm.yield(yieldData).then((yieldedPriceProducts: PriceProductDO[]) => {
				yieldedPriceProducts.forEach((priceProduct: PriceProductDO) => {
					should.equal(priceProduct.openIntervalList.length, 1);
				});
				done();
			}).catch((error: any) => {
				done(error);
			});
		});
		it("Should read the Yielded values of the Price Products", function (done) {
			var yieldPeriodDO = new YieldManagerPeriodDO();
			yieldPeriodDO.referenceDate = ThDateDO.buildThDateDO(2015, ThMonth.December, 31);
			yieldPeriodDO.noDays = 3;

			var ppReader = new PriceProductReader(testContext.appContext, testContext.sessionContext);
			ppReader.getYieldItems(yieldPeriodDO).then((yieldResult: PriceProductYieldResult) => {
				should.equal(yieldResult.dateList.length, 3);
				_.forEach(testDataBuilder.priceProductList, (priceProduct: PriceProductDO) => {
					var yieldItem: PriceProductYieldItem = _.find(yieldResult.itemList, (item: PriceProductYieldItem) => { return item.priceProductId === priceProduct.id });
					should.exist(yieldItem);
					should.equal(yieldItem.priceProductName, priceProduct.name);
					should.equal(yieldItem.lastRoomAvailability, priceProduct.lastRoomAvailability);
					should.equal(yieldItem.stateList.length, 3);

					should.equal(yieldItem.stateList[0].open, YieldItemStateType.Open);
					should.equal(yieldItem.stateList[1].open, YieldItemStateType.Open);
					should.equal(yieldItem.stateList[2].open, YieldItemStateType.Open);

					should.equal(yieldItem.stateList[0].openForArrival, YieldItemStateType.Closed);
					should.equal(yieldItem.stateList[1].openForArrival, YieldItemStateType.Closed);
					should.equal(yieldItem.stateList[2].openForArrival, YieldItemStateType.Closed);

					should.equal(yieldItem.stateList[0].openForDeparture, YieldItemStateType.Open);
					should.equal(yieldItem.stateList[1].openForDeparture, YieldItemStateType.Open);
					should.equal(yieldItem.stateList[2].openForDeparture, YieldItemStateType.Open);

					should.equal(yieldItem.dynamicPriceList.length >= 1, true);
					yieldItem.dynamicPriceList.forEach((dynamicPrice, index) => {
						should.equal(dynamicPrice.openList.length, 3);
						should.equal(dynamicPrice.dynamicPriceId.length > 1, true);
						should.equal(dynamicPrice.name.length > 1, true);
						should.equal(dynamicPrice.priceBriefString.length > 1, true);
						should.equal(dynamicPrice.roomCategoryNameForPriceBrief.length > 1, true);
						dynamicPrice.openList.forEach(open => {
							if (index == 0) {
								should.equal(open, YieldItemStateType.Open);
							}
							else {
								should.equal(open, YieldItemStateType.Closed);
							}
						});
					});
				});
				done();
			}).catch((error: any) => {
				done(error);
			});
		});

		it("Should not yield a dynamic price for price product with an invalid dynamic price id", function (done) {
			let priceProduct = _.find(testDataBuilder.priceProductList, priceProduct => { return priceProduct.price.dynamicPriceList.length > 1 });

			let yieldData = new DynamicPriceYieldingDO();
			yieldData.dynamicPriceId = "1452643156416";
			yieldData.priceProductId = priceProduct.id;
			let date = ThDateDO.buildThDateDO(2017, ThMonth.March, 22);
			yieldData.interval = ThDateIntervalDO.buildThDateIntervalDO(date, date);

			let ddYield = new DynamicPriceYielding(testContext.appContext, testContext.sessionContext);
			ddYield.open(yieldData).then(updatedPriceProduct => {
				done("Managed to yield a price product with an invalid dynamic price id");
			}).catch(e => {
				done();
			});
		});

		it("Should yield some dynamic rates and test whether they are enabled/disabled correspondingly", function (done) {
			let priceProduct = _.find(testDataBuilder.priceProductList, priceProduct => { return priceProduct.price.dynamicPriceList.length > 1 });
			let defaultPrice = priceProduct.price.dynamicPriceList[0];
			let dynamicPrice = priceProduct.price.dynamicPriceList[1];

			let beforeDate = ThDateDO.buildThDateDO(2017, ThMonth.March, 21);
			let date1 = ThDateDO.buildThDateDO(2017, ThMonth.March, 22);
			let date2 = ThDateDO.buildThDateDO(2017, ThMonth.March, 23);
			let afterDate = ThDateDO.buildThDateDO(2017, ThMonth.March, 24);

			should.equal(Object.keys(priceProduct.price.enabledDynamicPriceIdByDate).length, 0);

			let yieldData = new DynamicPriceYieldingDO();
			yieldData.dynamicPriceId = dynamicPrice.id;
			yieldData.priceProductId = priceProduct.id;
			yieldData.interval = ThDateIntervalDO.buildThDateIntervalDO(date1, date2);

			let ddYield = new DynamicPriceYielding(testContext.appContext, testContext.sessionContext);
			ddYield.open(yieldData).then(updatedPriceProduct => {
				should.equal(updatedPriceProduct.id, priceProduct.id);
				priceProduct = updatedPriceProduct;

				should.equal(Object.keys(priceProduct.price.enabledDynamicPriceIdByDate).length, 2);

				should.equal(priceProduct.price.getEnabledDynamicPriceForDate(beforeDate).id, defaultPrice.id);
				should.equal(priceProduct.price.getEnabledDynamicPriceForDate(date1).id, dynamicPrice.id);
				should.equal(priceProduct.price.getEnabledDynamicPriceForDate(date2).id, dynamicPrice.id);
				should.equal(priceProduct.price.getEnabledDynamicPriceForDate(afterDate).id, defaultPrice.id);

				yieldData.interval = ThDateIntervalDO.buildThDateIntervalDO(date2, date2);
				yieldData.dynamicPriceId = defaultPrice.id;

				return ddYield.open(yieldData);
			}).then(updatedPriceProduct => {
				should.equal(updatedPriceProduct.id, priceProduct.id);
				priceProduct = updatedPriceProduct;

				should.equal(Object.keys(priceProduct.price.enabledDynamicPriceIdByDate).length, 1);

				should.equal(priceProduct.price.getEnabledDynamicPriceForDate(beforeDate).id, defaultPrice.id);
				should.equal(priceProduct.price.getEnabledDynamicPriceForDate(date1).id, dynamicPrice.id);
				should.equal(priceProduct.price.getEnabledDynamicPriceForDate(date2).id, defaultPrice.id);
				should.equal(priceProduct.price.getEnabledDynamicPriceForDate(afterDate).id, defaultPrice.id);

				done();
			}).catch(e => {
				done(e);
			});
		});
	});

	describe("Yield Management Stress Test", function () {
		it("Should close a price product for one day " + StressTestIterations + " times", function (done) {
			var index = 0;
			var currentDate = ThDateDO.buildThDateDO(2016, ThMonth.January, 1);
			var priceProductIdList: string[] = [testDataBuilder.priceProductList[0].id];
			async.whilst(
				(() => {
					return index < StressTestIterations;
				}),
				((finishYieldingCallback: any) => {
					var yieldData: PriceProductYieldingDO = {
						priceProductIdList: priceProductIdList,
						action: PriceProductYieldAction.Close,
						forever: false,
						interval: ThDateIntervalDO.buildThDateIntervalDO(
							currentDate.buildPrototype(),
							currentDate.buildPrototype()
						)
					};
					var ppYm = new PriceProductYielding(testContext.appContext, testContext.sessionContext);
					ppYm.yield(yieldData).then((yieldedPriceProducts: PriceProductDO[]) => {
						currentDate = thDateUtils.addDaysToThDateDO(currentDate, 2);
						index++;
						finishYieldingCallback(null, true);
					}).catch((error: any) => {
						finishYieldingCallback(error);
					});
				}),
				((err: Error) => {
					done(err);
				})
			);
		});
	});

	describe("Inventory Snapshot Process Tests", function () {
		it("Should create a snapshot of the inventory", function (done) {
			var snapshotProcess = new HotelInventorySnapshotProcess(testContext.appContext, testDataBuilder.hotelDO);
			var referenceDate = ThTimestampDO.buildThTimestampForTimezone(testDataBuilder.hotelDO.timezone).thDateDO;
			snapshotProcess.createSnapshot(referenceDate).then((snapshotResult: InventorySnapshotProcessResult) => {
				should.equal(snapshotResult.type, InventorySnapshotType.New);
				var snapshot = snapshotResult.snapshot;
				should.exist(snapshot);
				should.equal(snapshot.roomList.length, testDataBuilder.roomList.length);
				should.equal(snapshot.allotments.activeAllotmentIdList.length, testDataBuilder.allotmentList.length);
				createdSnapshot = snapshot;
				done();
			}).catch((error: any) => {
				done(error);
			});
		});
		it("Should not create the same snapshot twice", function (done) {
			var snapshotProcess = new HotelInventorySnapshotProcess(testContext.appContext, testDataBuilder.hotelDO);
			var referenceDate = ThTimestampDO.buildThTimestampForTimezone(testDataBuilder.hotelDO.timezone).thDateDO;
			snapshotProcess.createSnapshot(referenceDate).then((snapshotResult: InventorySnapshotProcessResult) => {
				should.equal(snapshotResult.type, InventorySnapshotType.Existing);
				var snapshot = snapshotResult.snapshot;
				should.exist(snapshot);
				should.equal(snapshot.roomList.length, testDataBuilder.roomList.length);
				should.equal(snapshot.id, createdSnapshot.id);
				should.equal(snapshot.thDateUtcTimestamp, createdSnapshot.thDateUtcTimestamp);
				createdSnapshot = snapshot;
				done();
			}).catch((error: any) => {
				done(error);
			});
		});
	});

	describe("Key Metrics Tests", function () {
		it("Should get the key metrics for 14 days", function (done) {
			var yieldPeriodDO = new YieldManagerPeriodDO();
			yieldPeriodDO.referenceDate = ThDateDO.buildThDateDO(2015, ThMonth.December, 31);
			yieldPeriodDO.noDays = 14;
			var keyMetricReader = new KeyMetricReader(testContext.appContext, testContext.sessionContext);
			keyMetricReader.getKeyMetrics(
				new KeyMetricsReaderInputBuilder()
					.setYieldManagerPeriodDO(yieldPeriodDO)
					.build(),
					KeyMetricOutputType.YieldManager
			).then((keyMetricsResult: KeyMetricsResult) => {
				should.equal(keyMetricsResult.currentItem.dateList.length, 14);
				keyMetricsResult.currentItem.metricList.forEach((metric: KeyMetric) => {
					should.equal(metric.valueList.length, 14);
				});
				should.equal(keyMetricsResult.previousItem.dateList.length, 14);
				keyMetricsResult.previousItem.metricList.forEach((metric: KeyMetric) => {
					should.equal(metric.valueList.length, 14);
				});
				done();
			}).catch((error: any) => {
				done(error);
			});
		});
	});
});