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
import {CustomerDO, CustomerType} from '../../../../../core/data-layer/customers/data-objects/CustomerDO';
import {BookingDO, GroupBookingInputChannel, BookingConfirmationStatus} from '../../../../../core/data-layer/bookings/data-objects/BookingDO';
import {BookingChangeDates} from '../../../../../core/domain-layer/hotel-operations/booking/change-dates/BookingChangeDates';
import {BookingChangeDatesDO} from '../../../../../core/domain-layer/hotel-operations/booking/change-dates/BookingChangeDatesDO';
import {BookingChangeNoShowTime} from '../../../../../core/domain-layer/hotel-operations/booking/change-no-show-time/BookingChangeNoShowTime';
import {BookingChangeNoShowTimeDO} from '../../../../../core/domain-layer/hotel-operations/booking/change-no-show-time/BookingChangeNoShowTimeDO';
import {ThTimestampDO} from '../../../../../core/utils/th-dates/data-objects/ThTimestampDO';
import {ThHourDO} from '../../../../../core/utils/th-dates/data-objects/ThHourDO';
import {InvoicePaymentMethodDO, InvoicePaymentMethodType} from '../../../../../core/data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {FileAttachmentDO} from '../../../../../core/data-layer/common/data-objects/file/FileAttachmentDO';
import {BookingStateChangeTriggerType} from '../../../../../core/data-layer/bookings/data-objects/state-change-time/BookingStateChangeTriggerTimeDO';
import {BookingChangeCapacity} from '../../../../../core/domain-layer/hotel-operations/booking/change-capacity/BookingChangeCapacity';
import {BookingChangeCapacityDO} from '../../../../../core/domain-layer/hotel-operations/booking/change-capacity/BookingChangeCapacityDO';
import {BookingPaymentGuarantee} from '../../../../../core/domain-layer/hotel-operations/booking/payment-guarantee/BookingPaymentGuarantee';
import {BookingPaymentGuaranteeDO} from '../../../../../core/domain-layer/hotel-operations/booking/payment-guarantee/BookingPaymentGuaranteeDO';
import {BookingChangeDetails} from '../../../../../core/domain-layer/hotel-operations/booking/change-details/BookingChangeDetails';
import {BookingChangeDetailsDO} from '../../../../../core/domain-layer/hotel-operations/booking/change-details/BookingChangeDetailsDO';
import {BookingChangeCustomers} from '../../../../../core/domain-layer/hotel-operations/booking/change-customers/BookingChangeCustomers';
import {BookingChangeCustomersDO} from '../../../../../core/domain-layer/hotel-operations/booking/change-customers/BookingChangeCustomersDO';
import {BookingProcessFactory, BookingStatusChangerProcessType} from '../../../../../core/domain-layer/bookings/processes/BookingProcessFactory';
import {IBookingStatusChangerProcess} from '../../../../../core/domain-layer/bookings/processes/IBookingStatusChangerProcess';
import {BookingReactivate} from '../../../../../core/domain-layer/hotel-operations/booking/reactivate-booking/BookingReactivate';
import {BookingReactivateDO} from '../../../../../core/domain-layer/hotel-operations/booking/reactivate-booking/BookingReactivateDO';
import {BookingCancel} from '../../../../../core/domain-layer/hotel-operations/booking/cancel-booking/BookingCancel';
import {BookingCancelDO} from '../../../../../core/domain-layer/hotel-operations/booking/cancel-booking/BookingCancelDO';
import {EmailConfirmation} from '../../../../../core/domain-layer/hotel-operations/common/email-confirmations/EmailConfirmation';
import {EmailConfirmationDO, EmailConfirmationType} from '../../../../../core/domain-layer/hotel-operations/common/email-confirmations/EmailConfirmationDO';
import {BookingConfirmationEmailParameters} from '../../../../../core/domain-layer/hotel-operations/common/email-confirmations/utils/strategies/BookingEmailConfirmationStrategy';

describe("Hotel Booking Operations Tests", function () {
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;

    var testUtils: TestUtils;
    var bookingTestHelper: BookingTestHelper;
    var dashboardHelper: HotelDashboardOperationsTestHelper;

    var createdBookingList: BookingDO[];
    var bookingToChange: BookingDO;

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
        it("Should send an email confirmation for the booking", function (done) {
            bookingToChange = testUtils.getRandomListElement(createdBookingList);
            var emailConfirmationDO = new EmailConfirmationDO();
            emailConfirmationDO.type = EmailConfirmationType.Booking;
            emailConfirmationDO.emailList = ["ionut.paraschiv@3angle.tech"];
            var parameters: BookingConfirmationEmailParameters = {
                bookingId: bookingToChange.bookingId,
                groupBookingId: bookingToChange.groupBookingId
            }
            emailConfirmationDO.parameters = parameters;

            var emailConfirmation = new EmailConfirmation(testContext.appContext, testContext.sessionContext);
            emailConfirmation.send(emailConfirmationDO).then((sendResult: boolean) => {
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should change the date for a booking and double the price", function (done) {
            var bookingChangeDatesDO = new BookingChangeDatesDO();
            bookingChangeDatesDO.groupBookingId = bookingToChange.groupBookingId;
            bookingChangeDatesDO.bookingId = bookingToChange.bookingId;
            bookingChangeDatesDO.interval = dashboardHelper.getFromTomorrowTwoDaysInterval(testDataBuilder);
            var bookingChangeDates = new BookingChangeDates(testContext.appContext, testContext.sessionContext);
            bookingChangeDates.changeDates(bookingChangeDatesDO).then((updatedBooking: BookingDO) => {
                should.equal(updatedBooking.price.totalPrice, bookingToChange.price.totalPrice * 2);
                should.equal(updatedBooking.bookingHistory.actionList.length > 1, true);
                bookingToChange = updatedBooking;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should change no show time for one of the added bookings", function (done) {
            var noShowTimeDO = new BookingChangeNoShowTimeDO();
            noShowTimeDO.groupBookingId = bookingToChange.groupBookingId;
            noShowTimeDO.bookingId = bookingToChange.bookingId;
            noShowTimeDO.noShowTimestamp = new ThTimestampDO();
            noShowTimeDO.noShowTimestamp.thDateDO = bookingToChange.interval.start;
            noShowTimeDO.noShowTimestamp.thHourDO = ThHourDO.buildThHourDO(23, 30);

            var bookingChangeNoShowTime = new BookingChangeNoShowTime(testContext.appContext, testContext.sessionContext);
            bookingChangeNoShowTime.changeNoShowTime(noShowTimeDO).then((updatedBooking: BookingDO) => {
                should.equal(updatedBooking.noShowTime.type, BookingStateChangeTriggerType.ExactTimestamp);
                should.equal(updatedBooking.noShowTime.thTimestamp.thHourDO.hour, noShowTimeDO.noShowTimestamp.thHourDO.hour);
                should.equal(updatedBooking.noShowTime.thTimestamp.thHourDO.minute, noShowTimeDO.noShowTimestamp.thHourDO.minute);
                should.equal(updatedBooking.noShowTime.thTimestamp.thDateDO.day, noShowTimeDO.noShowTimestamp.thDateDO.day);
                should.equal(updatedBooking.noShowTime.thTimestamp.thDateDO.month, noShowTimeDO.noShowTimestamp.thDateDO.month);
                should.equal(updatedBooking.noShowTime.thTimestamp.thDateDO.year, noShowTimeDO.noShowTimestamp.thDateDO.year);
                bookingToChange = updatedBooking;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should change the capacity for one of the added bookings", function (done) {
            bookingToChange.configCapacity.noAdults--;
            bookingToChange.configCapacity.noChildren++;
            var changeCapacityDO = new BookingChangeCapacityDO();
            changeCapacityDO.groupBookingId = bookingToChange.groupBookingId;
            changeCapacityDO.bookingId = bookingToChange.bookingId;
            changeCapacityDO.configCapacity = bookingToChange.configCapacity;

            var bookingChangeCapacity = new BookingChangeCapacity(testContext.appContext, testContext.sessionContext);
            bookingChangeCapacity.changeCapacity(changeCapacityDO).then((updatedBooking: BookingDO) => {
                should.equal(updatedBooking.configCapacity.noAdults, bookingToChange.configCapacity.noAdults);
                should.equal(updatedBooking.configCapacity.noChildren, bookingToChange.configCapacity.noChildren);
                should.equal(updatedBooking.configCapacity.noBabies, bookingToChange.configCapacity.noBabies);
                bookingToChange = updatedBooking;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should add a payment guarantee on a booking", function (done) {
            var paymentGuaranteeDO = new BookingPaymentGuaranteeDO();
            paymentGuaranteeDO.groupBookingId = bookingToChange.groupBookingId;
            paymentGuaranteeDO.bookingId = bookingToChange.bookingId;
            paymentGuaranteeDO.paymentMethod = new InvoicePaymentMethodDO();
            paymentGuaranteeDO.paymentMethod.type = InvoicePaymentMethodType.DefaultPaymentMethod;
            var paymentMethod = testUtils.getRandomListElement(testDataBuilder.paymentMethodList);
            paymentGuaranteeDO.paymentMethod.value = paymentMethod.id;

            var bookingPaymentGuarantee = new BookingPaymentGuarantee(testContext.appContext, testContext.sessionContext);
            bookingPaymentGuarantee.addPaymentGuarantee(paymentGuaranteeDO).then((updatedBooking: BookingDO) => {
                should.equal(updatedBooking.defaultBillingDetails.paymentGuarantee, true);
                should.equal(updatedBooking.defaultBillingDetails.paymentMethod.type, InvoicePaymentMethodType.DefaultPaymentMethod);
                should.equal(updatedBooking.defaultBillingDetails.paymentMethod.value, paymentMethod.id);
                bookingToChange = updatedBooking;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should change the details on a booking", function (done) {
            var bookingChangeDetailsDO = new BookingChangeDetailsDO();
            bookingChangeDetailsDO.groupBookingId = bookingToChange.groupBookingId;
            bookingChangeDetailsDO.bookingId = bookingToChange.bookingId;
            bookingChangeDetailsDO.notes = "test test test!";
            var fileAttachment: FileAttachmentDO = new FileAttachmentDO();
            fileAttachment.name = "Supra File";
            fileAttachment.url = "3angle.tech/suprafile";
            bookingChangeDetailsDO.fileAttachmentList = [fileAttachment];

            var bookingChangeDetails = new BookingChangeDetails(testContext.appContext, testContext.sessionContext);
            bookingChangeDetails.changeDetails(bookingChangeDetailsDO).then((updatedBooking: BookingDO) => {
                should.equal(updatedBooking.notes, bookingChangeDetailsDO.notes);
                should.equal(bookingChangeDetailsDO.fileAttachmentList.length, 1);
                should.equal(bookingChangeDetailsDO.fileAttachmentList[0].name, fileAttachment.name);
                should.equal(bookingChangeDetailsDO.fileAttachmentList[0].url, fileAttachment.url);
                bookingToChange = updatedBooking;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });

        it("Should change the customers on a booking", function (done) {
            var changeCustomersDO = new BookingChangeCustomersDO();
            changeCustomersDO.groupBookingId = bookingToChange.groupBookingId;
            changeCustomersDO.bookingId = bookingToChange.bookingId;

            var individualCustomerList = _.filter(testDataBuilder.customerList, (customer: CustomerDO) => {
                return customer.type === CustomerType.Individual;
            });
            var customerIdList = _.map(individualCustomerList, (customer: CustomerDO) => { return customer.id });
            customerIdList.push(bookingToChange.defaultBillingDetails.customerId);
            changeCustomersDO.customerIdList = _.uniq(customerIdList);

            var bookingChangeCustomers = new BookingChangeCustomers(testContext.appContext, testContext.sessionContext);
            bookingChangeCustomers.changeCustomers(changeCustomersDO).then((updatedBooking: BookingDO) => {
                should.equal(testUtils.stringArraysAreEqual(updatedBooking.customerIdList, changeCustomersDO.customerIdList), true);
                bookingToChange = updatedBooking;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should mark the booking as No Show", function (done) {
            var bookingProcessFactory = new BookingProcessFactory(testContext.appContext, testDataBuilder.hotelDO);
            var markBookingsAsNoShowProcess: IBookingStatusChangerProcess = bookingProcessFactory.getBookingStatusChangerProcess(BookingStatusChangerProcessType.MarkBookingsAsNoShow);
            markBookingsAsNoShowProcess.changeStatuses(bookingTestHelper.getMaxTimestamp())
                .then((bookingList: BookingDO[]) => {
                    bookingToChange = _.find(bookingList, (booking: BookingDO) => {
                        return booking.bookingId === bookingToChange.bookingId && booking.groupBookingId === bookingToChange.groupBookingId;
                    });
                    should.exist(bookingToChange);
                    should.equal(bookingToChange.confirmationStatus === BookingConfirmationStatus.NoShow
                        || bookingToChange.confirmationStatus === BookingConfirmationStatus.NoShowWithPenalty, true);
                    done();
                }).catch((err: any) => {
                    done(err);
                });
        });
        it("Should reactivate the booking", function (done) {
            var bookingReactivateDO = new BookingReactivateDO();
            bookingReactivateDO.groupBookingId = bookingToChange.groupBookingId;
            bookingReactivateDO.bookingId = bookingToChange.bookingId;

            var bookingReactivate = new BookingReactivate(testContext.appContext, testContext.sessionContext);
            bookingReactivate.reactivate(bookingReactivateDO).then((updatedBooking: BookingDO) => {
                should.equal(updatedBooking.confirmationStatus === BookingConfirmationStatus.Confirmed
                    || updatedBooking.confirmationStatus === BookingConfirmationStatus.Guaranteed, true);
                bookingToChange = updatedBooking;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
        it("Should cancel the booking", function (done) {
            var bookingCancelDO = new BookingCancelDO();
            bookingCancelDO.groupBookingId = bookingToChange.groupBookingId;
            bookingCancelDO.bookingId = bookingToChange.bookingId;

            var bookingCancel = new BookingCancel(testContext.appContext, testContext.sessionContext);
            bookingCancel.cancel(bookingCancelDO).then((updatedBooking: BookingDO) => {
                should.equal(updatedBooking.confirmationStatus, BookingConfirmationStatus.Cancelled);
                bookingToChange = updatedBooking;
                done();
            }).catch((error: any) => {
                done(error);
            });
        });
    });
});