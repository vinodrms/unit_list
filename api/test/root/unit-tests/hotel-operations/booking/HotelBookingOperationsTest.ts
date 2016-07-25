require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {TestUtils} from '../../../../helpers/TestUtils';
import {BookingTestHelper} from '../../bookings/helpers/BookingTestHelper';
import {HotelDashboardOperationsTestHelper} from '../dashboard/helpers/HotelDashboardOperationsTestHelper';
import {PriceProductDO} from '../../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {AddBookingItems} from '../../../../../core/domain-layer/bookings/add-bookings/AddBookingItems';
import {BookingItemDO} from '../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import {BookingDO, GroupBookingInputChannel, BookingConfirmationStatus} from '../../../../../core/data-layer/bookings/data-objects/BookingDO';
import {BookingChangeDates} from '../../../../../core/domain-layer/hotel-operations/booking/change-dates/BookingChangeDates';
import {BookingChangeDatesDO} from '../../../../../core/domain-layer/hotel-operations/booking/change-dates/BookingChangeDatesDO';

describe("Hotel Booking Operations Tests", function () {
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;

    var testUtils: TestUtils;
    var bookingTestHelper: BookingTestHelper;
    var dashboardHelper: HotelDashboardOperationsTestHelper;

    var createdBookingList: BookingDO[];

    before(function (done: any) {
        testUtils = new TestUtils();
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        bookingTestHelper = new BookingTestHelper();
        dashboardHelper = new HotelDashboardOperationsTestHelper();
        testDataBuilder.buildWithDoneCallback(done);
    });

    describe("Booking Operations Tests", function () {
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
        it("Should change the date for a booking and double the price", function (done) {
            var bookingToChange = testUtils.getRandomListElement(createdBookingList);
            var bookingChangeDatesDO = new BookingChangeDatesDO();
            bookingChangeDatesDO.groupBookingId = bookingToChange.groupBookingId;
            bookingChangeDatesDO.bookingId = bookingToChange.bookingId;
            bookingChangeDatesDO.interval = dashboardHelper.getFromTomorrowTwoDaysInterval(testDataBuilder);
            var bookingChangeDates = new BookingChangeDates(testContext.appContext, testContext.sessionContext);
            bookingChangeDates.changeDates(bookingChangeDatesDO).then((updatedBooking: BookingDO) => {
                should.equal(updatedBooking.price.totalPrice, bookingToChange.price.totalPrice * 2);
                should.equal(updatedBooking.bookingHistory.actionList.length > 1, true);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
    });
});