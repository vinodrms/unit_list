require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {TestUtils} from '../../../../test/helpers/TestUtils';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {InvoicesTestHelper} from './helpers/InvoicesTestHelper';
import {SaveInvoiceGroupItemDO} from '../../../../core/domain-layer/invoices/SaveInvoiceGroupItemDO';
import {SaveInvoiceGroupItem} from '../../../../core/domain-layer/invoices/SaveInvoiceGroupItem';
import {InvoiceGroupDO} from '../../../../core/data-layer/invoices/data-objects/InvoiceGroupDO';

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

    describe("Invoice Groups Update Flow", function () {
        it("Should create a new invoice group item", function (done) {
            var saveInvoiceGroupItemDO: SaveInvoiceGroupItemDO = invoiceGroupsHelper.getValidSaveInvoiceGroupItemDO();
            var saveInvoiceGroupItem = new SaveInvoiceGroupItem(testContext.appContext, testContext.sessionContext);
            
            saveInvoiceGroupItem.save(saveInvoiceGroupItemDO).then((savedInvoiceGroup: InvoiceGroupDO) => {
                createdInvoiceGroup = savedInvoiceGroup;

                done();
            }).catch((err: any) => {
                done(err);
            });
        });

        it("Should update the previously created invoice group item", function (done) {
            var saveInvoiceGroupItemDO: SaveInvoiceGroupItemDO = invoiceGroupsHelper.getSaveInvoiceGroupItemDOFrom(createdInvoiceGroup);
            var saveInvoiceGroupItem = new SaveInvoiceGroupItem(testContext.appContext, testContext.sessionContext);
            debugger
            saveInvoiceGroupItem.save(saveInvoiceGroupItemDO).then((savedInvoiceGroup: InvoiceGroupDO) => {

                done();
            }).catch((err: any) => {
                done(err);
            });
        });
    });
});