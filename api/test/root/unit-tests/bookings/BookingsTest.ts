require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {BookingTestHelper} from './helpers/BookingTestHelper';
import {PriceProductDO} from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {AddBookingItems} from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItems';
import {AddBookingItemsDO} from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import {BookingDO, GroupBookingInputChannel} from '../../../../core/data-layer/bookings/data-objects/BookingDO';

describe("New Bookings Tests", function () {
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;

    var bookingTestHelper: BookingTestHelper;
    var genericPriceProduct: PriceProductDO;

    before(function (done: any) {
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        bookingTestHelper = new BookingTestHelper();
        testDataBuilder.buildWithDoneCallback(done);
    });

    describe("Create Booking Tests", function () {
        it("Should create a generic price product for the bookings", function (done) {
            bookingTestHelper.createGenericPriceProduct(testDataBuilder, testContext).then((priceProduct: PriceProductDO) => {
                genericPriceProduct = priceProduct;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should create " + BookingTestHelper.NoBookingGroups + " booking groups", function (done) {
            var promiseList: Promise<BookingDO[]>[] = [];
            for (var index = 0; index < BookingTestHelper.NoBookingGroups; index++) {
                var addBookings = new AddBookingItems(testContext.appContext, testContext.sessionContext);
                var bookingItems = bookingTestHelper.getBookingItems(testDataBuilder, genericPriceProduct);
                promiseList.push(addBookings.add(bookingItems, GroupBookingInputChannel.PropertyManagementSystem));
            }
            Promise.all(promiseList).then((groupBookingsList: BookingDO[][]) => {
                should.equal(groupBookingsList.length, BookingTestHelper.NoBookingGroups);
                done();
            }).catch((err: any) => {
                done(err);
            });
        });
    });
});