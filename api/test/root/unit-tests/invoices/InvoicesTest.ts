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
            
            generateBookingInvoice.generate(invoiceGroupsHelper.getGenerateBookingInvoiceDOForNewInvoiceGroup()).then((invoiceGroup: InvoiceGroupDO) => {
                createdInvoiceGroup = invoiceGroup;
                done();
            }).catch((e: ThError) => {
				done(e);
			});
        });

        it("Should generate a new booking invoice for a booking from the same booking group (-> update existing invoice group)", function (done) {
            var generateBookingInvoice = new GenerateBookingInvoice(testContext.appContext, testContext.sessionContext);
            
            generateBookingInvoice.generate(invoiceGroupsHelper.getGenerateBookingInvoiceDOForExistingInvoiceGroup()).then((invoiceGroup: InvoiceGroupDO) => {
                createdInvoiceGroup = invoiceGroup;
                debugger
                done();
            }).catch((e: ThError) => {
				done(e);
			});
        });

        it("Should get the previosly created booking invoice group", function (done) {
            done();
        });
    });
});