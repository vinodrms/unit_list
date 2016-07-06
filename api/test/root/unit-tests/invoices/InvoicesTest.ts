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
            done();
        });

        it("Should update the previously created invoice group item", function (done) {
            done();
        });
    });
});