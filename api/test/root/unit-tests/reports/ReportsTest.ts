require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import { TestUtils } from '../../../../test/helpers/TestUtils';
import { DefaultDataBuilder } from '../../../db-initializers/DefaultDataBuilder';
import { TestContext } from '../../../helpers/TestContext';
import { ReportsTestHelper } from './helpers/ReportsTestHelper';
import { PriceProductDO, PriceProductStatus } from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import { AddBookingItems } from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItems';
import { BookingDO, GroupBookingInputChannel, BookingConfirmationStatus } from '../../../../core/data-layer/bookings/data-objects/BookingDO';
import { BookingItemDO } from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import { HotelDashboardOperationsTestHelper } from '../hotel-operations/dashboard/helpers/HotelDashboardOperationsTestHelper';
import { ReportGenerator } from '../../../../core/domain-layer/reports/ReportGenerator';
import { ReportGeneratorDO, ReportGroupType, ReportOutputFormat } from '../../../../core/domain-layer/reports/ReportGeneratorDO';
import { ReportFileResult } from '../../../../core/domain-layer/reports/common/result/ReportFileResult';

describe("Reports", function () {
	var testUtils: TestUtils;
	var testContext: TestContext;
	var reportsTestHelper: ReportsTestHelper;
	var testDataBuilder: DefaultDataBuilder;
	var dashboardHelper: HotelDashboardOperationsTestHelper;
	var createdBookingList: BookingDO[];

	before(function (done: any) {
		testUtils = new TestUtils();
		testContext = new TestContext();
		testDataBuilder = new DefaultDataBuilder(testContext);
		reportsTestHelper = new ReportsTestHelper();
		dashboardHelper = new HotelDashboardOperationsTestHelper();
		testDataBuilder.buildWithDoneCallback(() => {
			reportsTestHelper.createGenericPriceProduct(testDataBuilder, testContext).then((priceProduct: PriceProductDO) => {
				var addBookings = new AddBookingItems(testContext.appContext, testContext.sessionContext);
				var bookingItems = reportsTestHelper.getBookingItems(testDataBuilder, priceProduct);
				bookingItems.bookingList.forEach((bookingItem: BookingItemDO) => {
					bookingItem.interval = dashboardHelper.getTodayToTomorrowInterval(testDataBuilder);
				});
				return addBookings.add(bookingItems, GroupBookingInputChannel.PropertyManagementSystem);
			}).then((bookingList: BookingDO[]) => {
				createdBookingList = bookingList;
				should.equal(createdBookingList.length > 0, true);
				done();
			}).catch((error: any) => {
				done(error);
			});
		});
	});

	describe("Report Tests", function () {
		it("Should generate the backup report", function (done) {
			let generator = new ReportGenerator(testContext.appContext, testContext.sessionContext);

			let generatorDO = new ReportGeneratorDO();
			generatorDO.properties = {};
			generatorDO.reportType = ReportGroupType.Backup;
			generatorDO.format = ReportOutputFormat.Csv;

			generator.getReport(generatorDO).then((reportFile: ReportFileResult) => {
				should.equal(reportFile.reportPath.length > 0, true);
				done();
			}).catch((e) => {
				done(e);
			});
		});
	});
});