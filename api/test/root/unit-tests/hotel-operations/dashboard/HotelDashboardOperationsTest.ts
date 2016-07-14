require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {BookingTestHelper} from '../../bookings/helpers/BookingTestHelper';
import {PriceProductDO, PriceProductAvailability} from '../../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {AddBookingItems} from '../../../../../core/domain-layer/bookings/add-bookings/AddBookingItems';
import {BookingItemDO} from '../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import {BookingDO, GroupBookingInputChannel, BookingConfirmationStatus} from '../../../../../core/data-layer/bookings/data-objects/BookingDO';
import {HotelDashboardOperationsTestHelper} from './helpers/HotelDashboardOperationsTestHelper';
import {HotelOperationsArrivalsReader} from '../../../../../core/domain-layer/hotel-operations/dashboard/arrivals/HotelOperationsArrivalsReader';
import {HotelOperationsArrivalsInfo, ArrivalItemInfo} from '../../../../../core/domain-layer/hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo';

function checkArrivals(createdBookingList: BookingDO[], arrivalsInfo: HotelOperationsArrivalsInfo) {
    should.equal(arrivalsInfo.arrivalInfoList.length >= createdBookingList.length, true);
    createdBookingList.forEach((booking: BookingDO) => {
        var arrivalItem = _.find(arrivalsInfo.arrivalInfoList, (item: ArrivalItemInfo) => { return item.bookingId === booking.bookingId });
        should.exist(arrivalItem);
        should.equal(arrivalItem.bookingId, booking.bookingId);
        should.equal(arrivalItem.roomCategoryId, booking.roomCategoryId);
        should.equal(arrivalItem.customerId, booking.displayCustomerId);
    });
}

describe("Hotel Dashboard Operations Tests", function () {
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;
    var bookingTestHelper: BookingTestHelper;
    var dashboardHelper: HotelDashboardOperationsTestHelper;

    var createdBookingList: BookingDO[];

    before(function (done: any) {
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        bookingTestHelper = new BookingTestHelper();
        dashboardHelper = new HotelDashboardOperationsTestHelper();
        testDataBuilder.buildWithDoneCallback(done);
    });

    describe("Dashboard Tests", function () {
        it("Should create a generic price product and a some bookings starting from today to tomorrow", function (done) {
            bookingTestHelper.createGenericPriceProduct(testDataBuilder, testContext).then((priceProduct: PriceProductDO) => {
                var addBookings = new AddBookingItems(testContext.appContext, testContext.sessionContext);
                var bookingItems = bookingTestHelper.getBookingItems(testDataBuilder, priceProduct);
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

        it("Should get the arrivals for today", function (done) {
            var arrivalsReader = new HotelOperationsArrivalsReader(testContext.appContext, testContext.sessionContext);
            arrivalsReader.read(dashboardHelper.getQueryForToday(testDataBuilder)).then((arrivalsInfo: HotelOperationsArrivalsInfo) => {
                checkArrivals(createdBookingList, arrivalsInfo);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should get the arrivals for today given a null reference date parameter", function (done) {
            var arrivalsReader = new HotelOperationsArrivalsReader(testContext.appContext, testContext.sessionContext);
            var emptyDateRefParam: any = {};
            arrivalsReader.read(emptyDateRefParam).then((arrivalsInfo: HotelOperationsArrivalsInfo) => {
                checkArrivals(createdBookingList, arrivalsInfo);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
    });
});