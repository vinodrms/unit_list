require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {TestUtils} from '../../../helpers/TestUtils';
import {BookingTestHelper} from './helpers/BookingTestHelper';
import {LazyLoadMetaResponseRepoDO} from '../../../../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import {PriceProductDO} from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {AddBookingItems} from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItems';
import {AddBookingItemsDO} from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import {BookingDO, GroupBookingInputChannel} from '../../../../core/data-layer/bookings/data-objects/BookingDO';
import {BookingSearchResultRepoDO} from '../../../../core/data-layer/bookings/repositories/IBookingRepository';
import {BookingConfirmationEmailSender} from '../../../../core/domain-layer/bookings/email/BookingConfirmationEmailSender';
import {BookingOccupancyCalculator} from '../../../../core/domain-layer/bookings/search-bookings/utils/occupancy-calculator/BookingOccupancyCalculator';
import {IBookingOccupancy} from '../../../../core/domain-layer/bookings/search-bookings/utils/occupancy-calculator/results/IBookingOccupancy';

describe("New Bookings Tests", function () {
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;

    var testUtils: TestUtils = new TestUtils();
    var bookingTestHelper: BookingTestHelper;
    var genericPriceProduct: PriceProductDO;

    var retrievedBookingList: BookingDO[];

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
    describe("Bookings Repository Tests", function () {
        it("Should the bookings filtered by a date interval", function (done) {
            var bookingRepo = testContext.appContext.getRepositoryFactory().getBookingRepository();
            bookingRepo.getBookingList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, {
                interval: bookingTestHelper.getBookingSearchInterval(testDataBuilder)
            }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
                retrievedBookingList = bookingSearchResult.bookingList;
                done();
            }).catch((err: any) => {
                done(err);
            });
        });
        it("Should the bookings count", function (done) {
            var bookingRepo = testContext.appContext.getRepositoryFactory().getBookingRepository();
            bookingRepo.getBookingListCount({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, {
                interval: bookingTestHelper.getBookingSearchInterval(testDataBuilder)
            }).then((lazyLoadResponse: LazyLoadMetaResponseRepoDO) => {
                should.equal(lazyLoadResponse.numOfItems, retrievedBookingList.length);
                done();
            }).catch((err: any) => {
                done(err);
            });
        });
        it("Should get the first " + BookingTestHelper.NoBookingGroups + " bookings", function (done) {
            var bookingRepo = testContext.appContext.getRepositoryFactory().getBookingRepository();
            bookingRepo.getBookingList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, {
                interval: bookingTestHelper.getBookingSearchInterval(testDataBuilder)
            }, {
                    pageNumber: 0,
                    pageSize: BookingTestHelper.NoBookingGroups
                }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
                    should.equal(bookingSearchResult.bookingList.length, BookingTestHelper.NoBookingGroups);
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });
        it("Should get booking by id", function (done) {
            var randomBooking: BookingDO = testUtils.getRandomListElement(retrievedBookingList);
            var bookingRepo = testContext.appContext.getRepositoryFactory().getBookingRepository();
            bookingRepo.getBookingById({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, randomBooking.groupBookingId, randomBooking.bookingId
            ).then((foundBooking: BookingDO) => {
                should.equal(randomBooking.bookingId, foundBooking.bookingId);
                should.equal(randomBooking.bookingReference, foundBooking.bookingReference);
                should.equal(randomBooking.groupBookingId, foundBooking.groupBookingId);
                should.equal(randomBooking.groupBookingReference, foundBooking.groupBookingReference);
                should.equal(randomBooking.roomCategoryId, foundBooking.roomCategoryId);
                should.equal(randomBooking.priceProductId, foundBooking.priceProductId);
                done();
            }).catch((err: any) => {
                done(err);
            });
        });

        it("Should send booking confirmation email", function (done) {
            var bookingRepo = testContext.appContext.getRepositoryFactory().getBookingRepository();
            bookingRepo.getBookingList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, {
                interval: bookingTestHelper.getBookingSearchInterval(testDataBuilder)
            }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
                var groupBookingReferenceList = _.chain(bookingSearchResult.bookingList).map((booking: BookingDO) => {
                    return booking.groupBookingId;
                }).uniq().value();

                var groupBookingArr = _.where(bookingSearchResult.bookingList, { groupBookingReference: groupBookingReferenceList[0] });

                var bookingConfirmationEmailSender = new BookingConfirmationEmailSender(testContext.appContext, testContext.sessionContext);
                return bookingConfirmationEmailSender.sendBookingConfirmation({
                    groupBookingId: groupBookingReferenceList[0]
                });
            }).then((result: boolean) => {
                done();
            }).catch((err: any) => {
                done(err);
            });
        });

    });
    describe("Bookings Search Tests", function () {
        it("Should invoke the booking occupancy calculator", function (done) {
            var occupancyCalculator = new BookingOccupancyCalculator(testContext.appContext, testContext.sessionContext, testDataBuilder.roomList);
            occupancyCalculator.compute(bookingTestHelper.getBookingSearchInterval(testDataBuilder))
                .then((bookingOccupancy: IBookingOccupancy) => {
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });
    });
});