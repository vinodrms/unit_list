require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import { ThError } from '../../../../core/utils/th-responses/ThError';
import { ThStatusCode } from '../../../../core/utils/th-responses/ThResponse';
import { DefaultDataBuilder } from '../../../db-initializers/DefaultDataBuilder';
import { TestContext } from '../../../helpers/TestContext';
import { TestUtils } from '../../../helpers/TestUtils';
import { BookingTestHelper } from './helpers/BookingTestHelper';
import { LazyLoadMetaResponseRepoDO } from '../../../../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import { SaveAllotmentItem } from '../../../../core/domain-layer/allotments/SaveAllotmentItem';
import { AllotmentDO } from '../../../../core/data-layer/allotments/data-objects/AllotmentDO';
import { AllotmentsHelper } from '../allotments/helpers/AllotmentsHelper';
import { CustomersTestHelper } from '../customers/helpers/CustomersTestHelper';
import { CustomerDO } from '../../../../core/data-layer/customers/data-objects/CustomerDO';
import { SaveCustomerItem } from '../../../../core/domain-layer/customers/SaveCustomerItem';
import { PriceProductDO, PriceProductAvailability } from '../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import { AddBookingItems } from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItems';
import { AddBookingItemsDO, BookingItemDO } from '../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import { BookingDO, GroupBookingInputChannel, BookingConfirmationStatus } from '../../../../core/data-layer/bookings/data-objects/BookingDO';
import { BookingPriceType } from '../../../../core/data-layer/bookings/data-objects/price/BookingPriceDO';
import { BookingSearchResultRepoDO } from '../../../../core/data-layer/bookings/repositories/IBookingRepository';
import { BookingConfirmationEmailSender } from '../../../../core/domain-layer/bookings/booking-confirmations/BookingConfirmationEmailSender';
import { BookingOccupancyCalculator } from '../../../../core/domain-layer/bookings/search-bookings/utils/occupancy-calculator/BookingOccupancyCalculator';
import { IBookingOccupancy } from '../../../../core/domain-layer/bookings/search-bookings/utils/occupancy-calculator/results/IBookingOccupancy';
import { BookingSearch } from '../../../../core/domain-layer/bookings/search-bookings/BookingSearch';
import { TransientBookingItemDO } from '../../../../core/domain-layer/bookings/search-bookings/TransientBookingItemDO';
import { BookingSearchResult, RoomCategoryItem } from '../../../../core/domain-layer/bookings/search-bookings/utils/result-builder/BookingSearchResult';
import { BookingProcessFactory, BookingStatusChangerProcessType } from '../../../../core/domain-layer/bookings/processes/BookingProcessFactory';
import { IBookingStatusChangerProcess } from '../../../../core/domain-layer/bookings/processes/IBookingStatusChangerProcess';
import { BookingChangeDates } from '../../../../core/domain-layer/hotel-operations/booking/change-dates/BookingChangeDates';
import { BookingChangeDatesDO } from '../../../../core/domain-layer/hotel-operations/booking/change-dates/BookingChangeDatesDO';

describe("New Bookings Tests", function () {
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;

    var testUtils: TestUtils = new TestUtils();
    var bookingTestHelper: BookingTestHelper;
    var genericPriceProduct: PriceProductDO;

    var randomGroupBookingId: string;
    var retrievedBookingList: BookingDO[];

    var allotmentsHelper: AllotmentsHelper;
    var custHelper: CustomersTestHelper;

    var addedCompanyCustomer: CustomerDO;
    var addedConfidentialPriceProduct: PriceProductDO;
    var addedAllotment: AllotmentDO;
    var addedBooking: BookingDO;

    var roomCategoryItem: RoomCategoryItem;

    before(function (done: any) {
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        bookingTestHelper = new BookingTestHelper();
        allotmentsHelper = new AllotmentsHelper(testDataBuilder, testContext);
        custHelper = new CustomersTestHelper(testDataBuilder, testContext);

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
                randomGroupBookingId = groupBookingsList[0][0].groupBookingId;
                done();
            }).catch((err: any) => {
                done(err);
            });
        });

        it("Should add a booking item to an existing booking group", function (done) {
            let initialNumberOfBookings = 0;
            let noOfNewBookings = 0;
            let bookingRepo = testContext.appContext.getRepositoryFactory().getBookingRepository();
            bookingRepo.getBookingList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { groupBookingId: randomGroupBookingId })
                .then((result: BookingSearchResultRepoDO) => {
                    initialNumberOfBookings = result.bookingList.length;
                    result.bookingList.forEach(booking => {
                        should.equal(booking.noOfRooms, initialNumberOfBookings);
                    });

                    let addBookingsDO: AddBookingItemsDO = bookingTestHelper.getBookingItems(testDataBuilder, genericPriceProduct);
                    addBookingsDO.groupBookingId = randomGroupBookingId;
                    noOfNewBookings = addBookingsDO.bookingList.length;

                    let addBookings = new AddBookingItems(testContext.appContext, testContext.sessionContext);
                    return addBookings.add(addBookingsDO, GroupBookingInputChannel.PropertyManagementSystem);
                }).then((result: BookingDO[]) => {
                    return bookingRepo.getBookingList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { groupBookingId: randomGroupBookingId });
                }).then((result: BookingSearchResultRepoDO) => {
                    should.equal(result.bookingList.length, initialNumberOfBookings + noOfNewBookings);
                    result.bookingList.forEach(booking => {
                        should.equal(booking.noOfRooms, initialNumberOfBookings + noOfNewBookings);
                    });
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });
    });
    describe("Bookings Repository Tests", function () {
        it("Should get the bookings filtered by a date interval", function (done) {
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
        it("Should get the bookings count", function (done) {
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
            bookingRepo.getBookingById({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, randomBooking.groupBookingId, randomBooking.id
            ).then((foundBooking: BookingDO) => {
                should.equal(randomBooking.id, foundBooking.id);
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
        it("Should invoke the booking search", function (done) {
            var bookingSearch = new BookingSearch(testContext.appContext, testContext.sessionContext);
            bookingSearch.search(bookingTestHelper.getPublicBookingSearchDO(testDataBuilder))
                .then((searchResult: BookingSearchResult) => {
                    should.equal(searchResult.priceProductItemList.length > 0, true);
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });
    });

    describe("Private Bookings Search Tests", function () {
        it("Should create a new customer with an attached price product and create an allotment", function (done) {
            addedConfidentialPriceProduct = _.find(testDataBuilder.priceProductList, (priceProduct: PriceProductDO) => { return priceProduct.availability === PriceProductAvailability.Confidential });

            var companyCustDO = custHelper.getCompanyCustomer(addedConfidentialPriceProduct.id);
            companyCustDO.priceProductDetails.allowPublicPriceProducts = true;

            var saveCustItem = new SaveCustomerItem(testContext.appContext, testContext.sessionContext);
            saveCustItem.save(companyCustDO)
                .then((cust: CustomerDO) => {
                    should.exist(cust.id);
                    addedCompanyCustomer = cust;
                    var allotmentItem = allotmentsHelper.getSaveAllotmentItemDO(addedCompanyCustomer, addedConfidentialPriceProduct);
                    var saveAllotmentItem = new SaveAllotmentItem(testContext.appContext, testContext.sessionContext);
                    return saveAllotmentItem.save(allotmentItem);
                }).then((savedAllotment: AllotmentDO) => {
                    should.exist(savedAllotment.id);
                    addedAllotment = savedAllotment;
                    done();
                }).catch((error: any) => {
                    done(error);
                });
        });
        it("Should invoke the booking search for the created customer", function (done) {
            var bookingSearch = new BookingSearch(testContext.appContext, testContext.sessionContext);
            bookingSearch.search(bookingTestHelper.getPrivateBookingSearchDO(testDataBuilder, addedCompanyCustomer))
                .then((searchResult: BookingSearchResult) => {
                    should.equal(searchResult.priceProductItemList.length > 0, true);
                    should.equal(searchResult.allotmentItemList.length > 0, true);
                    should.equal(searchResult.roomCategoryItemList.length > 0, true);
                    roomCategoryItem = _.find(searchResult.roomCategoryItemList, (roomCategItem: RoomCategoryItem) => {
                        return _.contains(addedConfidentialPriceProduct.roomCategoryIdList, roomCategItem.stats.roomCategory.id);
                    });
                    should.exist(roomCategoryItem);
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });

        it("Should invoke the booking search for the created customer and consider a transient booking", function (done) {
            var bookingSearch = new BookingSearch(testContext.appContext, testContext.sessionContext);
            var bookingSearchDO = bookingTestHelper.getPrivateBookingSearchWithTransientBookingDO(testDataBuilder, addedCompanyCustomer,
                addedConfidentialPriceProduct.id, roomCategoryItem.stats.roomCategory.id, addedAllotment.id);
            bookingSearch.search(bookingSearchDO)
                .then((searchResult: BookingSearchResult) => {
                    var newRoomCategoryItem = _.find(searchResult.roomCategoryItemList, (roomCategItem: RoomCategoryItem) => {
                        return _.contains(addedConfidentialPriceProduct.roomCategoryIdList, roomCategItem.stats.roomCategory.id);
                    });
                    should.equal(newRoomCategoryItem.noOccupiedRooms, roomCategoryItem.noOccupiedRooms + 1);
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });
    });
    describe("Create Booking With Allotment Tests", function () {
        it("Should create a booking with allotment", function (done) {
            var addBookings = new AddBookingItems(testContext.appContext, testContext.sessionContext);
            var bookingItems = bookingTestHelper.getBookingItems(testDataBuilder, addedConfidentialPriceProduct, addedAllotment);
            addBookings.add(bookingItems, GroupBookingInputChannel.PropertyManagementSystem)
                .then((bookingList: BookingDO[]) => {
                    addedBooking = bookingList[0];
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });
        it("Should change the dates for the booking made with allotment", function (done) {
            var bookingChangeDatesDO = new BookingChangeDatesDO();
            bookingChangeDatesDO.groupBookingId = addedBooking.groupBookingId;
            bookingChangeDatesDO.id = addedBooking.id;
            bookingChangeDatesDO.interval = bookingTestHelper.generateRandomFutureInterval(testDataBuilder);
            var bookingChangeDates = new BookingChangeDates(testContext.appContext, testContext.sessionContext);
            bookingChangeDates.changeDates(bookingChangeDatesDO).then((updatedBooking: BookingDO) => {
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
    });

    describe("Booking Processes Tests", function () {
        it("Should mark some bookings as Guaranteed", function (done) {
            var bookingProcessFactory = new BookingProcessFactory(testContext.appContext, testDataBuilder.hotelDO);
            var markBookingsAsGuaranteeProcess: IBookingStatusChangerProcess = bookingProcessFactory.getBookingStatusChangerProcess(BookingStatusChangerProcessType.MarkBookingsAsGuaranteed);
            markBookingsAsGuaranteeProcess.changeStatuses(bookingTestHelper.getMaxTimestamp())
                .then((bookingList: BookingDO[]) => {
                    bookingList.forEach((booking: BookingDO) => {
                        should.equal(booking.confirmationStatus, BookingConfirmationStatus.Guaranteed);
                        should.equal(booking.bookingHistory.actionList.length > 0, true);
                    });
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });
        it("Should not mark other bookings as Guaranteed", function (done) {
            var bookingProcessFactory = new BookingProcessFactory(testContext.appContext, testDataBuilder.hotelDO);
            var markBookingsAsGuaranteeProcess: IBookingStatusChangerProcess = bookingProcessFactory.getBookingStatusChangerProcess(BookingStatusChangerProcessType.MarkBookingsAsGuaranteed);
            markBookingsAsGuaranteeProcess.changeStatuses(bookingTestHelper.getMaxTimestamp())
                .then((bookingList: BookingDO[]) => {
                    should.equal(bookingList.length, 0);
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });
        it("Should mark some bookings as No Show", function (done) {
            var bookingProcessFactory = new BookingProcessFactory(testContext.appContext, testDataBuilder.hotelDO);
            var markBookingsAsNoShowProcess: IBookingStatusChangerProcess = bookingProcessFactory.getBookingStatusChangerProcess(BookingStatusChangerProcessType.MarkBookingsAsNoShow);
            markBookingsAsNoShowProcess.changeStatuses(bookingTestHelper.getMaxTimestamp())
                .then((bookingList: BookingDO[]) => {
                    bookingList.forEach((booking: BookingDO) => {
                        should.equal((booking.confirmationStatus === BookingConfirmationStatus.NoShow || booking.confirmationStatus === BookingConfirmationStatus.NoShowWithPenalty), true);
                        should.equal(booking.bookingHistory.actionList.length > 0, true);
                        if (booking.confirmationStatus === BookingConfirmationStatus.NoShow) {
                            should.equal(booking.price.priceType, BookingPriceType.BookingStay);
                        }
                        else {
                            should.equal(booking.price.priceType, BookingPriceType.Penalty);
                        }
                    });
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });
        it("Should not mark other bookings as No Show", function (done) {
            var bookingProcessFactory = new BookingProcessFactory(testContext.appContext, testDataBuilder.hotelDO);
            var markBookingsAsNoShowProcess: IBookingStatusChangerProcess = bookingProcessFactory.getBookingStatusChangerProcess(BookingStatusChangerProcessType.MarkBookingsAsNoShow);
            markBookingsAsNoShowProcess.changeStatuses(bookingTestHelper.getMaxTimestamp())
                .then((bookingList: BookingDO[]) => {
                    should.equal(bookingList.length, 0);
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });
    });
});