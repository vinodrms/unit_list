require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');

import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode} from '../../../../core/utils/th-responses/ThResponse';
import {DefaultDataBuilder} from '../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../helpers/TestContext';
import {TestUtils} from '../../../../test/helpers/TestUtils';
import {ReportsTestHelper} from './helpers/ReportsTestHelper';

import {HtmlReportsServiceResponse} from '../../../../core/services/html-reports/IHtmlReportsService';
import fs = require("fs");

describe("PDF Reports Tests", function () {
    var testUtils: TestUtils;
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;
    var testHelper: ReportsTestHelper;

    before(function (done: any) {
        testUtils = new TestUtils();
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        testDataBuilder.buildWithDoneCallback(done);
        testHelper = new ReportsTestHelper(testDataBuilder);
    });

    describe("PDF Reports Generation Flow", function () {
        it("Should generate an invoice pdf", function (done) {
            var serviceFactory = testContext.appContext.getServiceFactory();
            var htmlReportsService = serviceFactory.getHtmlReportsService(serviceFactory.getHtmltoPdfConverterService());
            htmlReportsService.generateReport(testHelper.getInvoicePdfReportRequest()).then((response: HtmlReportsServiceResponse) => {
                fs.exists(response.pdfPath, (exists) => {
                    exists ? done() : done(response.pdfPath + ' not found!');
                });
            }).catch((err: any) => {
                done(err);
            });

        });
        // it("Should generate a booking confirmation pdf", function (done) {
        //     var serviceFactory = testContext.appContext.getServiceFactory();
        //     var htmlReportsService = serviceFactory.getHtmlReportsService(serviceFactory.getHtmltoPdfConverterService());
        //     htmlReportsService.generateReport(testHelper.getBookingConfirmationPdfReportRequest()).then((response: HtmlReportsServiceResponse) => {
        //         fs.exists(response.pdfPath, (exists) => {
        //             exists ? done() : done(response.pdfPath + ' not found!');
        //         });
        //     }).catch((err: any) => {
        //         done(err);
        //     });
        // });
    });
});