require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {TestUtils} from '../../../../test/helpers/TestUtils';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {InvoicesTestHelper} from './helpers/InvoicesTestHelper';
import {InvoiceGroupDO} from '../../../../core/data-layer/invoices/data-objects/InvoiceGroupDO';
import {GenerateBookingInvoice} from '../../../../core/domain-layer/invoices/bookings/GenerateBookingInvoice';
import {InvoiceGroupSearchResultRepoDO} from '../../../../core/data-layer/invoices/repositories/IInvoiceGroupsRepository';

describe("Invoices Tests", function () {
    var testUtils: TestUtils;
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;
    var invoiceGroupsHelper: InvoicesTestHelper;

    var createdInvoiceGroup: InvoiceGroupDO;

    before(function (done: any) {
        testUtils = new TestUtils();
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        testDataBuilder.buildWithDoneCallback(done);
        invoiceGroupsHelper = new InvoicesTestHelper(testDataBuilder);
    });

    describe("Invoice Groups Generation Flow", function () {
        it("Should generate a new booking invoice (new invoice group)", function (done) {
            var generateBookingInvoice = new GenerateBookingInvoice(testContext.appContext, testContext.sessionContext);
            var generateBookingInvoiceDO = invoiceGroupsHelper.getGenerateBookingInvoiceDOForNewInvoiceGroup();
            generateBookingInvoice.generate(generateBookingInvoiceDO).then((invoiceGroup: InvoiceGroupDO) => {
                createdInvoiceGroup = invoiceGroup;
                should.equal(invoiceGroup.groupBookingId, generateBookingInvoiceDO.groupBookingId);
                should.equal(createdInvoiceGroup.invoiceList.length, 1);
                should.equal(createdInvoiceGroup.invoiceList[0].bookingId, generateBookingInvoiceDO.bookingId);
                should.equal(createdInvoiceGroup.invoiceList[0].itemList.length, 1);
                done();
            }).catch((e: ThError) => {
                done(e);
            });
        });

        it("Should generate a new booking invoice for a booking from the same booking group (-> update existing invoice group)", function (done) {
            var generateBookingInvoice = new GenerateBookingInvoice(testContext.appContext, testContext.sessionContext);
            var generateBookingInvoiceDO = invoiceGroupsHelper.getGenerateBookingInvoiceDOForExistingInvoiceGroup();
            generateBookingInvoice.generate(generateBookingInvoiceDO).then((invoiceGroup: InvoiceGroupDO) => {
                createdInvoiceGroup = invoiceGroup;
                should.equal(createdInvoiceGroup.invoiceList.length, 2);
                should.equal(createdInvoiceGroup.invoiceList[1].bookingId, generateBookingInvoiceDO.bookingId);
                should.equal(createdInvoiceGroup.invoiceList[1].itemList.length, 1);
                done();
            }).catch((e: ThError) => {
                done(e);
            });
        });

        it("Should get the previosly created booking invoice group by invoice group id", function (done) {
            var invoiceGroupsRepo = testContext.appContext.getRepositoryFactory().getInvoiceGroupsRepository();
            invoiceGroupsRepo.getInvoiceGroupById({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, createdInvoiceGroup.id)
                .then((loadedInvoiceGroup: InvoiceGroupDO) => {
                    should.equal(loadedInvoiceGroup.groupBookingId, createdInvoiceGroup.groupBookingId);
                    should.equal(loadedInvoiceGroup.invoiceList.length, createdInvoiceGroup.invoiceList.length);
                    for (var i = 0; i < loadedInvoiceGroup.invoiceList.length; ++i) {
                        should.equal(loadedInvoiceGroup.invoiceList[i].bookingId, createdInvoiceGroup.invoiceList[i].bookingId);
                        should.equal(loadedInvoiceGroup.invoiceList[i].itemList.length, createdInvoiceGroup.invoiceList[i].itemList.length);
                    }
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });

        it("Should get the previosly created booking invoice group by group booking id", function (done) {
            var invoiceGroupsRepo = testContext.appContext.getRepositoryFactory().getInvoiceGroupsRepository();
            invoiceGroupsRepo.getInvoiceGroupList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, { groupBookingId: createdInvoiceGroup.groupBookingId })
                .then((result: InvoiceGroupSearchResultRepoDO) => {
                    should.equal(result.invoiceGroupList.length, 1);
                    var loadedInvoiceGroup = result.invoiceGroupList[0];
                    should.equal(loadedInvoiceGroup.groupBookingId, createdInvoiceGroup.groupBookingId);
                    should.equal(loadedInvoiceGroup.invoiceList.length, createdInvoiceGroup.invoiceList.length);
                    for (var i = 0; i < loadedInvoiceGroup.invoiceList.length; ++i) {
                        should.equal(loadedInvoiceGroup.invoiceList[i].bookingId, createdInvoiceGroup.invoiceList[i].bookingId);
                        should.equal(loadedInvoiceGroup.invoiceList[i].itemList.length, createdInvoiceGroup.invoiceList[i].itemList.length);
                    }
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });
    });
});