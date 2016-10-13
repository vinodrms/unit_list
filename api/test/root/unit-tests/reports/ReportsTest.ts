require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import { ThError } from '../../../../core/utils/th-responses/ThError';
import { ThStatusCode } from '../../../../core/utils/th-responses/ThResponse';
import { TestUtils } from '../../../../test/helpers/TestUtils';
import { DefaultDataBuilder } from '../../../db-initializers/DefaultDataBuilder';
import { TestContext } from '../../../helpers/TestContext';
import { ReportsTestHelper } from './helpers/ReportsTestHelper';
import { ReportMetadataDO, ReportType } from '../../../../core/data-layer/reports/data-objects/ReportMetadataDO';
import { ReportDO } from '../../../../core/data-layer/reports/data-objects/ReportDO';
import { ReportGeneratorFactory} from '../../../../core/domain-layer/reports/ReportGeneratorFactory';
import { ReportGroupGeneratorFactory, ReportGroupType} from '../../../../core/domain-layer/reports/ReportGroupGeneratorFactory';
import { ExpectedReports } from './ExpectedReports';
import { PriceProductDO, PriceProductStatus } from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import { AddBookingItems } from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItems';
import { BookingDO, GroupBookingInputChannel, BookingConfirmationStatus } from '../../../../core/data-layer/bookings/data-objects/BookingDO';
import { BookingItemDO } from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import { HotelOperationsArrivalsReader } from '../../../../core/domain-layer/hotel-operations/dashboard/arrivals/HotelOperationsArrivalsReader';
import { HotelOperationsArrivalsInfo, ArrivalItemInfo } from '../../../../core/domain-layer/hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo';

import { RoomCategoryDO } from '../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import { RoomDO } from '../../../../core/data-layer/rooms/data-objects/RoomDO';
import { ReportArrivalsReader } from '../../../../core/domain-layer/reports/backup-report/arrivals/ReportArrivalsReader';

import { BackUpReportCollectionGenerator } from '../../../../core/domain-layer/reports/backup-report/BackUpReportCollectionGenerator';

//TODO: rewrite
import { HotelDashboardOperationsTestHelper } from '../hotel-operations/dashboard/helpers/HotelDashboardOperationsTestHelper';
import _ = require('underscore');

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
				//TODO: Add reserved bookings
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
		it("Should generate report with real data", function (done) {
			let rgGeneratorFactory = new ReportGroupGeneratorFactory(testContext.appContext, testContext.sessionContext);
			let rgGenerator = rgGeneratorFactory.getGeneratorStrategy(ReportGroupType.Backup);
			rgGenerator.generate({}).then(result => {
				(result.data.length).should.be.above(0);
				(result.data[0].length).should.be.equal(result.metadata.columns.length);
				// console.log(JSON.stringify(result, null, '\t'));
				done();
			}).catch(err =>{
				done(err);
			})
		});
	});
});