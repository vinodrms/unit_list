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
import {AddNewBookingInvoice} from '../../../../core/domain-layer/invoices/add-invoice/bookings/AddNewBookingInvoice';
import {UpdateInvoiceGroup} from '../../../../core/domain-layer/invoices/update-invoice-groups/UpdateInvoiceGroup';
import {UpdateInvoiceGroupDO} from '../../../../core/domain-layer/invoices/update-invoice-groups/UpdateInvoiceGroupDO';

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
        // it("Should create a new invoice group related to an already created booking", function (done) {
        //     var addNewBookingInvoiceGroup = new AddNewBookingInvoice(testContext.appContext, testContext.sessionContext);
            
        //     addNewBookingInvoiceGroup.addNewBookingInvoiceItem(invoiceGroupsHelper.getAddNewBookingInvoiceGroupDO()).then((invoiceGroup: InvoiceGroupDO) => {
        //         createdInvoiceGroup = invoiceGroup;
        //         done();
        //     }).catch((e: ThError) => {
		// 		done(e);
		// 	});
        // });

        // it("Should get the previosly created booking related invoice group", function (done) {
        //     var updateInvoiceGroup = new UpdateInvoiceGroup(testContext.appContext, testContext.sessionContext);
        //     updateInvoiceGroup.update(invoiceGroupsHelper.getUpdateInvoiceGroupDO(createdInvoiceGroup)).then((updatedInvoiceGroup: InvoiceGroupDO) => {
        //         done();
        //     }).catch((e: ThError) => {
        //         done(e);
        //     });
        // });
    });
});