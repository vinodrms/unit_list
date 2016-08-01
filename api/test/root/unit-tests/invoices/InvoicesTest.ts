require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {TestUtils} from '../../../../test/helpers/TestUtils';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {BookingInvoicesTestHelper} from './helpers/BookingInvoicesTestHelper';
import {CustomerInvoicesTestHelper} from './helpers/CustomerInvoicesTestHelper';
import {InvoiceGroupDO} from '../../../../core/data-layer/invoices/data-objects/InvoiceGroupDO';
import {GenerateBookingInvoice} from '../../../../core/domain-layer/invoices/generate-booking-invoice/GenerateBookingInvoice';
import {InvoiceGroupSearchResultRepoDO} from '../../../../core/data-layer/invoices/repositories/IInvoiceGroupsRepository';
import {InvoiceEmailSender} from '../../../../core/domain-layer/invoices/email/InvoiceEmailSender';
import {SaveInvoiceGroup} from '../../../../core/domain-layer/invoices/save-invoice-group/SaveInvoiceGroup';
import {SaveInvoiceGroupDO} from '../../../../core/domain-layer/invoices/save-invoice-group/SaveInvoiceGroupDO';
import {InvoiceTestUtils} from './utils/InvoiceTestUtils';
import {InvoiceDO} from '../../../../core/data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceGroupBriefDO} from '../../../../core/data-layer/invoices/data-objects/brief/InvoiceGroupBriefDO';
import {InvoiceGroupBriefContainerDO} from '../../../../core/data-layer/invoices/data-objects/brief/InvoiceGroupBriefContainerDO';
import {InvoiceGroupsBriefDataAggregator} from '../../../../core/domain-layer/invoices/aggregators/InvoiceGroupsBriefDataAggregator';
import {InvoicePayerDO} from '../../../../core/data-layer/invoices/data-objects/payers/InvoicePayerDO';

describe("Invoices Tests", function () {
    var testUtils: TestUtils;
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;
    var bookingInvoiceGroupsHelper: BookingInvoicesTestHelper;
    var customerInvoiceGroupsHelper: CustomerInvoicesTestHelper;
    var invoiceTestUtils: InvoiceTestUtils;

    var createdBookingInvoiceGroup: InvoiceGroupDO;
    var createdCustomerInvoiceGroup: InvoiceGroupDO;

    before(function (done: any) {
        testUtils = new TestUtils();
        testContext = new TestContext();
        invoiceTestUtils = new InvoiceTestUtils();
        testDataBuilder = new DefaultDataBuilder(testContext);
        testDataBuilder.buildWithDoneCallback(done);
        bookingInvoiceGroupsHelper = new BookingInvoicesTestHelper(testDataBuilder);
        customerInvoiceGroupsHelper = new CustomerInvoicesTestHelper(testDataBuilder);
    });

    describe("Booking Invoice Groups Flow", function () {
        it("Should generate a new booking invoice (new invoice group)", function (done) {
            var generateBookingInvoice = new GenerateBookingInvoice(testContext.appContext, testContext.sessionContext);
            var generateBookingInvoiceDO = bookingInvoiceGroupsHelper.buildGenerateBookingInvoiceDOForNewInvoiceGroup();
            generateBookingInvoice.generate(generateBookingInvoiceDO).then((invoiceGroup: InvoiceGroupDO) => {
                createdBookingInvoiceGroup = invoiceGroup;
                should.equal(invoiceGroup.groupBookingId, generateBookingInvoiceDO.groupBookingId);
                should.equal(createdBookingInvoiceGroup.invoiceList.length, 1);
                should.equal(createdBookingInvoiceGroup.invoiceList[0].bookingId, generateBookingInvoiceDO.bookingId);
                should.equal(createdBookingInvoiceGroup.invoiceList[0].itemList.length, 1);
                done();
            }).catch((e: ThError) => {
                done(e);
            });
        });

        it("Should generate a new booking invoice for a booking from the same booking group (-> update existing invoice group)", function (done) {
            var generateBookingInvoice = new GenerateBookingInvoice(testContext.appContext, testContext.sessionContext);
            var generateBookingInvoiceDO = bookingInvoiceGroupsHelper.buildGenerateBookingInvoiceDOForExistingInvoiceGroup();
            generateBookingInvoice.generate(generateBookingInvoiceDO).then((invoiceGroup: InvoiceGroupDO) => {
                createdBookingInvoiceGroup = invoiceGroup;
                should.equal(createdBookingInvoiceGroup.invoiceList.length, 2);
                should.equal(createdBookingInvoiceGroup.invoiceList[1].bookingId, generateBookingInvoiceDO.bookingId);
                should.equal(createdBookingInvoiceGroup.invoiceList[1].itemList.length, 1);
                done();
            }).catch((e: ThError) => {
                done(e);
            });
        });

        it("Should get the previosly created booking invoice group by INVOICE GROUP id", function (done) {
            var invoiceGroupsRepo = testContext.appContext.getRepositoryFactory().getInvoiceGroupsRepository();
            invoiceGroupsRepo.getInvoiceGroupById({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, createdBookingInvoiceGroup.id)
                .then((loadedInvoiceGroup: InvoiceGroupDO) => {
                    should.equal(loadedInvoiceGroup.groupBookingId, createdBookingInvoiceGroup.groupBookingId);
                    should.equal(loadedInvoiceGroup.invoiceList.length, createdBookingInvoiceGroup.invoiceList.length);
                    for (var i = 0; i < loadedInvoiceGroup.invoiceList.length; ++i) {
                        should.equal(loadedInvoiceGroup.invoiceList[i].bookingId, createdBookingInvoiceGroup.invoiceList[i].bookingId);
                        should.equal(loadedInvoiceGroup.invoiceList[i].itemList.length, createdBookingInvoiceGroup.invoiceList[i].itemList.length);
                    }
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });

        it("Should get the previosly created booking invoice group by GROUP BOOKING id", function (done) {
            var invoiceGroupsRepo = testContext.appContext.getRepositoryFactory().getInvoiceGroupsRepository();
            invoiceGroupsRepo.getInvoiceGroupList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { groupBookingId: createdBookingInvoiceGroup.groupBookingId })
                .then((result: InvoiceGroupSearchResultRepoDO) => {
                    should.equal(result.invoiceGroupList.length, 1);
                    var loadedInvoiceGroup = result.invoiceGroupList[0];
                    should.equal(loadedInvoiceGroup.groupBookingId, createdBookingInvoiceGroup.groupBookingId);
                    should.equal(loadedInvoiceGroup.invoiceList.length, createdBookingInvoiceGroup.invoiceList.length);
                    for (var i = 0; i < loadedInvoiceGroup.invoiceList.length; ++i) {
                        should.equal(loadedInvoiceGroup.invoiceList[i].bookingId, createdBookingInvoiceGroup.invoiceList[i].bookingId);
                        should.equal(loadedInvoiceGroup.invoiceList[i].itemList.length, createdBookingInvoiceGroup.invoiceList[i].itemList.length);
                    }
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });

        it("[query by CUSTOMER ID LIST] Should get the invoice groups which contain at least an invoice which has one of the customers passed as arguments as payer", function (done) {
            var invoiceGroupsRepo = testContext.appContext.getRepositoryFactory().getInvoiceGroupsRepository();
            invoiceGroupsRepo.getInvoiceGroupList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: InvoiceGroupSearchResultRepoDO) => {
                var allInvoiceGroups = result.invoiceGroupList;
                var customerIdQueryList = invoiceTestUtils.getDistinctCustomerIdListFromInvoiceGroupList(allInvoiceGroups)
                invoiceGroupsRepo.getInvoiceGroupList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { customerIdList: customerIdQueryList })
                    .then((result: InvoiceGroupSearchResultRepoDO) => {
                        should.equal(allInvoiceGroups.length, result.invoiceGroupList.length);
                        done();
                    }).catch((e: ThError) => {
                        done(e);
                    });
            }).catch((e: ThError) => {
                done(e);
            });
        });

        it("Should update the previously created booking invoice group by adding a new invoice to it", function (done) {

            var saveInvoiceGroup = new SaveInvoiceGroup(testContext.appContext, testContext.sessionContext);
            bookingInvoiceGroupsHelper.buildSaveInvoiceGroupDOForUpdatingBookingInvoiceGroup(createdBookingInvoiceGroup).then((saveInvoiceGroupDO: SaveInvoiceGroupDO) => {
                saveInvoiceGroup.save(saveInvoiceGroupDO).then((savedInvoiceGroup: InvoiceGroupDO) => {
                    createdBookingInvoiceGroup = savedInvoiceGroup;
                    invoiceTestUtils.testInvoiceGroupEquality(savedInvoiceGroup, saveInvoiceGroupDO);
                    done();
                }).catch((err: any) => {
                    done(err);
                });
            }).catch((err: any) => {
                done(err);
            });
        });
    });

    describe("Customer Invoice Groups Flow", function () {

        it("Should add a new customer invoice group with one invoice", function (done) {
            var saveInvoiceGroupDO = customerInvoiceGroupsHelper.buildSaveInvoiceGroupDOForAddingNewCustomerInvoiceGroup();
            var saveInvoiceGroup = new SaveInvoiceGroup(testContext.appContext, testContext.sessionContext);

            saveInvoiceGroup.save(saveInvoiceGroupDO).then((savedInvoiceGroup: InvoiceGroupDO) => {
                createdCustomerInvoiceGroup = savedInvoiceGroup;
                invoiceTestUtils.testInvoiceGroupEquality(savedInvoiceGroup, saveInvoiceGroupDO);
                done();
            }).catch((err: any) => {
                done(err);
            });
        });

        it("Should update the previously created customer invoice group by adding a new invoice to it", function (done) {
            var saveInvoiceGroupDO = customerInvoiceGroupsHelper.buildSaveInvoiceGroupDOForUpdatingCustomerInvoiceGroup(createdCustomerInvoiceGroup);
            var saveInvoiceGroup = new SaveInvoiceGroup(testContext.appContext, testContext.sessionContext);
            
            saveInvoiceGroup.save(saveInvoiceGroupDO).then((savedInvoiceGroup: InvoiceGroupDO) => {
                createdCustomerInvoiceGroup = savedInvoiceGroup;
                invoiceTestUtils.testInvoiceGroupEquality(savedInvoiceGroup, saveInvoiceGroupDO);
                done();
            }).catch((err: any) => {
                done(err);
            });
        });
    });

    describe("Invoice Aggregators", function () {
        it("Should aggregate invoice groups data (brief) by customer id", function (done) {
            var invoiceGroupBriefDataAggregator = new InvoiceGroupsBriefDataAggregator(testContext.appContext, testContext.sessionContext);
            var invoiceGroupsRepo = testContext.appContext.getRepositoryFactory().getInvoiceGroupsRepository();
            debugger
            invoiceGroupsRepo.getInvoiceGroupList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }).then((result: InvoiceGroupSearchResultRepoDO) => {
                var allInvoiceGroups = result.invoiceGroupList;
                var defaultInvoiceIndex = _.findIndex(allInvoiceGroups, (invoiceGroup: InvoiceGroupDO) => {
                    return invoiceGroup.id === testDataBuilder.invoiceGroupList[0].id;
                });
                allInvoiceGroups.splice(defaultInvoiceIndex, 1);

                var customerIdList = invoiceTestUtils.getDistinctCustomerIdListFromInvoiceGroupList(allInvoiceGroups);
                
                invoiceGroupBriefDataAggregator.getBriefDataByCustomerList(customerIdList).then((invoiceGroupBriefContainerList: InvoiceGroupBriefContainerDO[]) => {
                    should.equal(invoiceGroupBriefContainerList.length, customerIdList.length);

                    _.chain(invoiceGroupBriefContainerList).map((invoiceGroupBriefContainerDO: InvoiceGroupBriefContainerDO) => {
                        return invoiceGroupBriefContainerDO.invoiceGroupBriefList;
                    }).flatten().map((invoiceBriefDO: InvoiceGroupBriefDO) => {
                        return invoiceBriefDO.price;
                    }).forEach((price: number) => {
                        should.notEqual(price, 0);
                    });
                    done();
                }).catch((error) => {
                    done(error);
                });                
            }).catch((error) => {
                done(error);
            });     
        });
    });

    describe("Invoice Email Sender Flow", function () {
        it("Should send the invoice by email", function (done) {
            var invoiceEmailSender = new InvoiceEmailSender(testContext.appContext, testContext.sessionContext);
            invoiceEmailSender.sendInvoice({}, ['dragos.pricope@gmail.com']).then((result: boolean) => {

                done();
            }).catch((err: any) => {
                done(err);
            });
        });
    });
});