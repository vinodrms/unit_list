require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require("underscore");

import { ThError } from '../../../../../core/utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../core/utils/th-responses/ThResponse';
import { DefaultDataBuilder } from '../../../../db-initializers/DefaultDataBuilder';
import { TestContext } from '../../../../helpers/TestContext';
import { BookingTestHelper } from '../../bookings/helpers/BookingTestHelper';
import { PriceProductDO, PriceProductAvailability } from '../../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import { AddBookingItems } from '../../../../../core/domain-layer/bookings/add-bookings/AddBookingItems';
import { BookingItemDO } from '../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import { BookingDO, GroupBookingInputChannel, BookingConfirmationStatus } from '../../../../../core/data-layer/bookings/data-objects/BookingDO';
import { HotelDashboardOperationsTestHelper } from './helpers/HotelDashboardOperationsTestHelper';
import { HotelOperationsArrivalsReader } from '../../../../../core/domain-layer/hotel-operations/dashboard/arrivals/HotelOperationsArrivalsReader';
import { HotelOperationsArrivalsInfo, ArrivalItemInfo } from '../../../../../core/domain-layer/hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo';
import { HotelOperationsRoomInfoReader } from '../../../../../core/domain-layer/hotel-operations/dashboard/room-info/HotelOperationsRoomInfoReader';
import { HotelOperationsRoomInfo, RoomItemStatus } from '../../../../../core/domain-layer/hotel-operations/dashboard/room-info/utils/HotelOperationsRoomInfo';
import { AssignRoom } from '../../../../../core/domain-layer/hotel-operations/room/assign/AssignRoom';
import { AssignRoomDO } from '../../../../../core/domain-layer/hotel-operations/room/assign/AssignRoomDO';
import { HotelOperationsDeparturesReader } from '../../../../../core/domain-layer/hotel-operations/dashboard/departures/HotelOperationsDeparturesReader';
import { HotelOperationsDeparturesInfo, DeparturelItemInfo, DeparturelItemBookingStatus } from '../../../../../core/domain-layer/hotel-operations/dashboard/departures/utils/HotelOperationsDeparturesInfo';
import { CheckOutRoom } from '../../../../../core/domain-layer/hotel-operations/room/check-out/CheckOutRoom';
import { CheckOutRoomDO } from '../../../../../core/domain-layer/hotel-operations/room/check-out/CheckOutRoomDO';
import { BookingPossiblePrices } from '../../../../../core/domain-layer/hotel-operations/booking/possible-prices/BookingPossiblePrices';
import { BookingPossiblePricesDO } from '../../../../../core/domain-layer/hotel-operations/booking/possible-prices/BookingPossiblePricesDO';
import { BookingPossiblePriceItems, BookingPriceItem } from '../../../../../core/domain-layer/hotel-operations/booking/possible-prices/utils/BookingPossiblePriceItems';
import { MarkOccupiedCleanRoomsAsDirtyProcess } from '../../../../../core/domain-layer/hotel-operations/room/processes/MarkOccupiedCleanRoomsAsDirtyProcess';
import { RoomDO, RoomMaintenanceStatus } from '../../../../../core/data-layer/rooms/data-objects/RoomDO';
import { RoomAttachedBooking } from '../../../../../core/domain-layer/hotel-operations/room/attached-booking/RoomAttachedBooking';
import { RoomAttachedBookingDO } from '../../../../../core/domain-layer/hotel-operations/room/attached-booking/RoomAttachedBookingDO';
import { RoomAttachedBookingResult, RoomAttachedBookingResultType } from '../../../../../core/domain-layer/hotel-operations/room/attached-booking/utils/RoomAttachedBookingResult';
import { UnreserveRoom } from "../../../../../core/domain-layer/hotel-operations/room/unreserve/UnreserveRoom";
import { UnreserveRoomDO } from "../../../../../core/domain-layer/hotel-operations/room/unreserve/UnreserveRoomDO";

function checkArrivals(createdBookingList: BookingDO[], arrivalsInfo: HotelOperationsArrivalsInfo) {
    should.equal(arrivalsInfo.arrivalInfoList.length >= createdBookingList.length, true);
    createdBookingList.forEach((booking: BookingDO) => {
        var arrivalItem = _.find(arrivalsInfo.arrivalInfoList, (item: ArrivalItemInfo) => { return item.bookingId === booking.id });
        should.exist(arrivalItem);
        should.equal(arrivalItem.bookingId, booking.id);
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
    var booking: BookingDO;
    var attachedRoom: RoomDO;

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
        it("Should get an empty room info array for today", function (done) {
            var roomInfoReader = new HotelOperationsRoomInfoReader(testContext.appContext, testContext.sessionContext);
            roomInfoReader.read().then((arrivalsInfo: HotelOperationsRoomInfo) => {
                should.equal(arrivalsInfo.roomInfoList.length, 0);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should not get any checked or reserved bookings for a room", function (done) {
            booking = createdBookingList[0];
            attachedRoom = dashboardHelper.getRoomForSameRoomCategoryFromBooking(testDataBuilder, booking);
            var roomAttachedBooking = new RoomAttachedBooking(testContext.appContext, testContext.sessionContext);
            roomAttachedBooking.getBooking(new RoomAttachedBookingDO(attachedRoom.id)).then((attachedBookingResult: RoomAttachedBookingResult) => {
                should.equal(attachedBookingResult.resultType, RoomAttachedBookingResultType.NoBooking);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should reserve, unreserve and reserve back a room for one of the added bookings", function (done) {
            var assignRoomDO = new AssignRoomDO();
            assignRoomDO.bookingId = booking.id;
            assignRoomDO.groupBookingId = booking.groupBookingId;
            assignRoomDO.roomId = attachedRoom.id;
            var assignRoom = new AssignRoom(testContext.appContext, testContext.sessionContext);
            assignRoom.reserveRoom(assignRoomDO).then((updatedBooking: BookingDO) => {
                should.equal(updatedBooking.roomId, attachedRoom.id);
                should.equal(updatedBooking.confirmationStatus, booking.confirmationStatus);
                booking = updatedBooking;

                let unreserveRoomDO = new UnreserveRoomDO();
                unreserveRoomDO.bookingId = booking.id;
                unreserveRoomDO.groupBookingId = booking.groupBookingId;
                let unreserveRoom = new UnreserveRoom(testContext.appContext, testContext.sessionContext);
                return unreserveRoom.unreserve(unreserveRoomDO);
            }).then((updatedBooking: BookingDO) => {
                should.equal(_.isEmpty(updatedBooking.roomId), true);

                return assignRoom.reserveRoom(assignRoomDO);
            }).then((updatedBooking: BookingDO) => {
                should.equal(updatedBooking.roomId, attachedRoom.id);
                should.equal(updatedBooking.confirmationStatus, booking.confirmationStatus);

                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should get the attached booking for the room as Reserved", function (done) {
            var roomAttachedBooking = new RoomAttachedBooking(testContext.appContext, testContext.sessionContext);
            roomAttachedBooking.getBooking(new RoomAttachedBookingDO(attachedRoom.id)).then((attachedBookingResult: RoomAttachedBookingResult) => {
                should.equal(attachedBookingResult.resultType, RoomAttachedBookingResultType.ReservedBooking);
                should.exist(attachedBookingResult.booking);
                should.equal(attachedBookingResult.booking.id, booking.id);
                should.equal(attachedBookingResult.booking.groupBookingId, booking.groupBookingId);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should get the possible prices for the booking and include the current price", function (done) {
            var possiblePrices = new BookingPossiblePrices(testContext.appContext, testContext.sessionContext);
            var possiblePricesDO = new BookingPossiblePricesDO();
            possiblePricesDO.id = booking.id;
            possiblePricesDO.groupBookingId = booking.groupBookingId;
            possiblePrices.getPossiblePrices(possiblePricesDO).then((priceItems: BookingPossiblePriceItems) => {
                should.equal(priceItems.priceItemList.length > 0, true);
                var priceItem: BookingPriceItem = _.find(priceItems.priceItemList, (item: BookingPriceItem) => { return item.roomCategoryId === booking.roomCategoryId });
                should.exist(priceItem);
                should.equal(priceItem.price, booking.price.totalBookingPrice);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should get the reserved booking in the room info", function (done) {
            var roomInfoReader = new HotelOperationsRoomInfoReader(testContext.appContext, testContext.sessionContext);
            roomInfoReader.read().then((arrivalsInfo: HotelOperationsRoomInfo) => {
                should.equal(arrivalsInfo.roomInfoList.length, 1);
                should.equal(arrivalsInfo.roomInfoList[0].roomStatus, RoomItemStatus.Reserved);
                should.equal(arrivalsInfo.roomInfoList[0].bookingId, booking.id);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should still see the room in the arrivals section", function (done) {
            var arrivalsReader = new HotelOperationsArrivalsReader(testContext.appContext, testContext.sessionContext);
            arrivalsReader.read(dashboardHelper.getQueryForToday(testDataBuilder)).then((arrivalsInfo: HotelOperationsArrivalsInfo) => {
                checkArrivals(createdBookingList, arrivalsInfo);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should not see any departures for today", function (done) {
            var departuresReader = new HotelOperationsDeparturesReader(testContext.appContext, testContext.sessionContext);
            departuresReader.read(dashboardHelper.getQueryForToday(testDataBuilder)).then((departuresInfo: HotelOperationsDeparturesInfo) => {
                should.equal(departuresInfo.departureInfoList.length, testDataBuilder.getNoUnpaidInvoices());
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should see all the bookings as departures tomorrow", function (done) {
            var departuresReader = new HotelOperationsDeparturesReader(testContext.appContext, testContext.sessionContext);
            departuresReader.read(dashboardHelper.getQueryForTomorrow(testDataBuilder)).then((departuresInfo: HotelOperationsDeparturesInfo) => {
                departuresInfo.departureInfoList.forEach((departureItem: DeparturelItemInfo) => {
                    should.equal(departureItem.bookingItemStatus, DeparturelItemBookingStatus.CanNotCheckOut);
                });
                should.equal(departuresInfo.departureInfoList.length, createdBookingList.length + testDataBuilder.getNoUnpaidInvoices());
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should not mark any rooms as dirty (no checked in booking)", function (done) {
            var roomProcess = new MarkOccupiedCleanRoomsAsDirtyProcess(testContext.appContext, testDataBuilder.hotelDO);
            roomProcess.runProcess().then((updatedRoomList: RoomDO[]) => {
                should.equal(updatedRoomList.length, 0);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should check in the reserved booking", function (done) {
            createdBookingList = _.filter(createdBookingList, (createdBooking: BookingDO) => { return createdBooking.id !== booking.id });

            var assignRoomDO = new AssignRoomDO();
            assignRoomDO.bookingId = booking.id;
            assignRoomDO.groupBookingId = booking.groupBookingId;
            assignRoomDO.roomId = booking.roomId;
            var assignRoom = new AssignRoom(testContext.appContext, testContext.sessionContext);
            assignRoom.checkIn(assignRoomDO).then((updatedBooking: BookingDO) => {
                should.equal(updatedBooking.confirmationStatus, BookingConfirmationStatus.CheckedIn);
                booking = updatedBooking;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should get the attached booking for the room as CheckedIn", function (done) {
            var roomAttachedBooking = new RoomAttachedBooking(testContext.appContext, testContext.sessionContext);
            roomAttachedBooking.getBooking(new RoomAttachedBookingDO(attachedRoom.id)).then((attachedBookingResult: RoomAttachedBookingResult) => {
                should.equal(attachedBookingResult.resultType, RoomAttachedBookingResultType.CheckedInBooking);
                should.exist(attachedBookingResult.booking);
                should.equal(attachedBookingResult.booking.id, booking.id);
                should.equal(attachedBookingResult.booking.groupBookingId, booking.groupBookingId);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should mark the checked in room as dirty", function (done) {
            var roomProcess = new MarkOccupiedCleanRoomsAsDirtyProcess(testContext.appContext, testDataBuilder.hotelDO);
            roomProcess.runProcess().then((updatedRoomList: RoomDO[]) => {
                should.equal(updatedRoomList.length, 1);
                should.equal(updatedRoomList[0].maintenanceHistory.actionList.length > 0, true);
                should.equal(updatedRoomList[0].maintenanceStatus, RoomMaintenanceStatus.Dirty);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should get the checked in booking in the room info", function (done) {
            var roomInfoReader = new HotelOperationsRoomInfoReader(testContext.appContext, testContext.sessionContext);
            roomInfoReader.read().then((arrivalsInfo: HotelOperationsRoomInfo) => {
                should.equal(arrivalsInfo.roomInfoList.length, 1);
                should.equal(arrivalsInfo.roomInfoList[0].roomStatus, RoomItemStatus.Occupied);
                should.equal(arrivalsInfo.roomInfoList[0].bookingId, booking.id);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should not see the room in the arrivals section any more", function (done) {
            var arrivalsReader = new HotelOperationsArrivalsReader(testContext.appContext, testContext.sessionContext);
            arrivalsReader.read(dashboardHelper.getQueryForToday(testDataBuilder)).then((arrivalsInfo: HotelOperationsArrivalsInfo) => {
                checkArrivals(createdBookingList, arrivalsInfo);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should still see all the bookings as departures tomorrow even though we checked in one booking", function (done) {
            var departuresReader = new HotelOperationsDeparturesReader(testContext.appContext, testContext.sessionContext);
            departuresReader.read(dashboardHelper.getQueryForTomorrow(testDataBuilder)).then((departuresInfo: HotelOperationsDeparturesInfo) => {
                should.equal(departuresInfo.departureInfoList.length, createdBookingList.length + 1 + testDataBuilder.getNoUnpaidInvoices());
                departuresInfo.departureInfoList.forEach((departureItem: DeparturelItemInfo) => {
                    if (departureItem.bookingId === booking.id) {
                        should.equal(departureItem.bookingItemStatus, DeparturelItemBookingStatus.CanCheckOut);
                    }
                    else {
                        should.equal(departureItem.bookingItemStatus, DeparturelItemBookingStatus.CanNotCheckOut);
                    }
                });
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should check out the room", function (done) {
            var checkOutDO = new CheckOutRoomDO();
            checkOutDO.bookingId = booking.id;
            checkOutDO.groupBookingId = booking.groupBookingId;
            var checkOutRoomOp = new CheckOutRoom(testContext.appContext, testContext.sessionContext);
            checkOutRoomOp.checkOut(checkOutDO).then((checkedOutBooking: BookingDO) => {
                should.equal(checkedOutBooking.confirmationStatus, BookingConfirmationStatus.CheckedOut);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should not see the checked out booking in the departures", function (done) {
            var departuresReader = new HotelOperationsDeparturesReader(testContext.appContext, testContext.sessionContext);
            departuresReader.read(dashboardHelper.getQueryForTomorrow(testDataBuilder)).then((departuresInfo: HotelOperationsDeparturesInfo) => {
                should.equal(departuresInfo.departureInfoList.length, createdBookingList.length + 1 + testDataBuilder.getNoUnpaidInvoices());
                departuresInfo.departureInfoList.forEach((departureItem: DeparturelItemInfo) => {
                    should.equal(departureItem.bookingItemStatus, DeparturelItemBookingStatus.CanNotCheckOut);
                });
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should get an empty room info array for today because the booking was checked out", function (done) {
            var roomInfoReader = new HotelOperationsRoomInfoReader(testContext.appContext, testContext.sessionContext);
            roomInfoReader.read().then((arrivalsInfo: HotelOperationsRoomInfo) => {
                should.equal(arrivalsInfo.roomInfoList.length, 0);
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
    });
});
