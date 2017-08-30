require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require('underscore');
import { TestUtils } from "../../../helpers/TestUtils";
import { TestContext } from "../../../helpers/TestContext";
import { DefaultDataBuilder } from "../../../db-initializers/DefaultDataBuilder";
import { InvoiceDO, InvoicePaymentStatus } from "../../../../core/data-layer/invoices/data-objects/InvoiceDO";
import { InvoicePayerDO } from "../../../../core/data-layer/invoices/data-objects/payer/InvoicePayerDO";
import { CustomerDO } from "../../../../core/data-layer/customers/data-objects/CustomerDO";
import { SaveInvoice } from "../../../../core/domain-layer/invoices/save-invoice/SaveInvoice";
import { ThError } from "../../../../core/utils/th-responses/ThError";
import { InvoicesTestHelper } from "./helpers/InvoicesTestHelper";
import { InvoiceSearchResultRepoDO } from "../../../../core/data-layer/invoices/repositories/IInvoiceRepository";

describe("Invoices Tests", function () {
    var testUtils: TestUtils;
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;
    var helper: InvoicesTestHelper;

    var invoice: InvoiceDO;

    before(function (done: any) {
        testUtils = new TestUtils();
        testContext = new TestContext();
        testDataBuilder = new DefaultDataBuilder(testContext);
        testDataBuilder.buildWithDoneCallback(done);
    });

    describe("Basic walk-in invoices' flows", function () {
        it("Should create a new invoice with no items", function (done) {
            helper = new InvoicesTestHelper(testDataBuilder);

            let invoiceToCreate = helper.getUnpaidInvoiceWithOnePayer();
            let saveInvoice = new SaveInvoice(testContext.appContext, testContext.sessionContext);
            saveInvoice.save(invoiceToCreate)
                .then((createdInvoice: InvoiceDO) => {
                    should.exist(createdInvoice.id);
                    should.exist(createdInvoice.reference);
                    should.exist(createdInvoice.groupId);
                    should.equal(createdInvoice.amountPaid, 0.0);
                    should.equal(createdInvoice.amountToPay, 0.0);
                    should.equal(createdInvoice.indexedBookingIdList.length, 0);
                    should.equal(createdInvoice.indexedCustomerIdList.length, 1);
                    should.equal(createdInvoice.indexedCustomerIdList[0], invoiceToCreate.payerList[0].customerId);
                    should.equal(createdInvoice.payerList.length, 1);
                    should.equal(testUtils.thUtils.isUndefinedOrNull(createdInvoice.paidTimestamp), true);
                    invoice = createdInvoice;

                    let invoiceRepo = testContext.appContext.getRepositoryFactory().getInvoiceRepository();
                    return invoiceRepo.getInvoiceById({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, invoice.id);
                }).then((readInvoice: InvoiceDO) => {
                    should.equal(_.isEqual(invoice, readInvoice), true, "The created invoice should be read correctly from the repository");
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });

        it("Should not mark as Paid an invoice with no items", function (done) {
            let invoiceToSave = new InvoiceDO();
            invoiceToSave.buildFromObject(invoice);
            invoiceToSave.paymentStatus = InvoicePaymentStatus.Paid;
            let saveInvoice = new SaveInvoice(testContext.appContext, testContext.sessionContext);
            saveInvoice.save(invoiceToSave)
                .then((updatedInvoice: InvoiceDO) => {
                    done(new Error("Managed to mark as Paid an invoice with no items"));
                }).catch((e: ThError) => {
                    done();
                });
        });

        it("Should add 2 new items to the invoice", function (done) {
            let item1 = helper.getAddOnProductItem();
            let item2 = helper.getAddOnProductItem();
            invoice.itemList = [item1, item2];
            let saveInvoice = new SaveInvoice(testContext.appContext, testContext.sessionContext);
            saveInvoice.save(invoice)
                .then((updatedInvoice: InvoiceDO) => {
                    should.equal(updatedInvoice.amountPaid, 0.0);
                    should.equal(updatedInvoice.amountToPay, item1.getTotalPrice() + item2.getTotalPrice());
                    should.equal(updatedInvoice.itemList.length, 2);
                    should.exist(updatedInvoice.itemList[0].transactionId);
                    should.exist(updatedInvoice.itemList[0].timestamp);

                    invoice = updatedInvoice;

                    let invoiceRepo = testContext.appContext.getRepositoryFactory().getInvoiceRepository();
                    return invoiceRepo.getInvoiceList({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, {
                        groupId: invoice.groupId
                    });
                }).then((result: InvoiceSearchResultRepoDO) => {
                    should.equal(result.invoiceList.length, 1, "The invoice's group should only contain 1 invoice");
                    should.equal(_.isEqual(invoice, result.invoiceList[0]), true, "The updated invoice has some different attributes than the one read via the getInvoiceList method");

                    let invoiceRepo = testContext.appContext.getRepositoryFactory().getInvoiceRepository();
                    return invoiceRepo.getInvoiceListCount({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, {
                        groupId: invoice.groupId
                    });
                }).then(countResult => {
                    should.equal(countResult.numOfItems, 1, "The invoice's group should only contain 1 invoice");
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });

        it("Should remove an item from the invoice", function (done) {
            let itemToDelete = invoice.itemList[0];
            let itemRemaining = invoice.itemList[1];

            let saveInvoice = new SaveInvoice(testContext.appContext, testContext.sessionContext);
            saveInvoice.save(invoice, [itemToDelete.transactionId])
                .then((updatedInvoice: InvoiceDO) => {
                    should.equal(updatedInvoice.amountPaid, 0.0);
                    should.equal(updatedInvoice.amountToPay, itemRemaining.getTotalPrice());
                    should.equal(updatedInvoice.itemList.length, 1);
                    should.equal(updatedInvoice.itemList[0].transactionId, itemRemaining.transactionId);
                    should.equal(updatedInvoice.itemList[0].timestamp, itemRemaining.timestamp);

                    invoice = updatedInvoice;
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });

        it("Should add a new item from the invoice", function (done) {
            let itemToAdd = helper.getAddOnProductItem();
            invoice.itemList.push(itemToAdd);

            let saveInvoice = new SaveInvoice(testContext.appContext, testContext.sessionContext);
            saveInvoice.save(invoice)
                .then((updatedInvoice: InvoiceDO) => {
                    should.equal(updatedInvoice.amountPaid, 0.0);
                    should.equal(updatedInvoice.amountToPay, itemToAdd.getTotalPrice() + invoice.amountToPay);
                    should.equal(updatedInvoice.itemList.length, 2);

                    invoice = updatedInvoice;
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });

        it("Should add a new payer with a payment consisting in half from the total invoice's amount to pay", function (done) {
            let existingCustomerId = invoice.indexedCustomerIdList[0];
            let additionalCustomer: CustomerDO = _.find(testDataBuilder.customerList, (customer: CustomerDO) => {
                return customer.id != existingCustomerId && customer.isIndividual();
            });
            let additionalPayer = new InvoicePayerDO();
            additionalPayer.customerId = additionalCustomer.id;
            let paidAmount = invoice.amountToPay / 2.0;
            additionalPayer.paymentList = [
                helper.getPayment(paidAmount)
            ];
            invoice.payerList.push(additionalPayer);

            let saveInvoice = new SaveInvoice(testContext.appContext, testContext.sessionContext);
            saveInvoice.save(invoice)
                .then((updatedInvoice: InvoiceDO) => {
                    should.equal(updatedInvoice.amountPaid, paidAmount);
                    should.equal(updatedInvoice.indexedCustomerIdList.length, 2);
                    should.equal(updatedInvoice.itemList.length, 2);
                    should.equal(updatedInvoice.payerList[1].customerId, additionalCustomer.id);
                    should.equal(updatedInvoice.payerList[1].paymentList.length, 1);
                    should.equal(updatedInvoice.payerList[1].paymentList[0].amount, paidAmount);

                    invoice = updatedInvoice;
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });

        it("Should not delete the payer that has a transaction", function (done) {
            let payer: InvoicePayerDO = _.find(invoice.payerList, (payer: InvoicePayerDO) => { return payer.paymentList.length > 0; });

            let saveInvoice = new SaveInvoice(testContext.appContext, testContext.sessionContext);
            saveInvoice.save(invoice, null, [payer.customerId])
                .then((updatedInvoice: InvoiceDO) => {
                    done(new Error("Managed to remove the payer that already has a transaction on the invoice"));
                }).catch((e: ThError) => {
                    done();
                });
        });

        it("Should delete a payer with no transactions", function (done) {
            let payer: InvoicePayerDO = _.find(invoice.payerList, (payer: InvoicePayerDO) => { return payer.paymentList.length == 0; });

            let saveInvoice = new SaveInvoice(testContext.appContext, testContext.sessionContext);
            saveInvoice.save(invoice, null, [payer.customerId])
                .then((updatedInvoice: InvoiceDO) => {
                    should.equal(updatedInvoice.indexedCustomerIdList.length, 1);
                    should.notEqual(updatedInvoice.indexedCustomerIdList[0], payer.customerId);
                    should.equal(updatedInvoice.payerList.length, 1);
                    should.notEqual(updatedInvoice.payerList[0].customerId, payer.customerId);
                    should.equal(updatedInvoice.payerList[0].paymentList.length, 1);

                    invoice = updatedInvoice;
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });

        it("Should not mark the invoice as Paid because the paid amount is less than the amount to pay", function (done) {
            let invoiceToSave = new InvoiceDO();
            invoiceToSave.buildFromObject(invoice);
            invoiceToSave.paymentStatus = InvoicePaymentStatus.Paid;

            let saveInvoice = new SaveInvoice(testContext.appContext, testContext.sessionContext);
            saveInvoice.save(invoiceToSave)
                .then((updatedInvoice: InvoiceDO) => {
                    done(new Error("Managed to mark as Paid an invoice with the paid amount less than the amount to pay"));
                }).catch((e: ThError) => {
                    done();
                });
        });

        it("Should add a new transaction so that the amount to pay with be equal with the paid amount", function (done) {
            let additionalPayment = helper.getPayment(invoice.amountToPay - invoice.amountPaid);
            invoice.payerList[0].paymentList.push(additionalPayment);

            let saveInvoice = new SaveInvoice(testContext.appContext, testContext.sessionContext);
            saveInvoice.save(invoice)
                .then((updatedInvoice: InvoiceDO) => {
                    should.equal(updatedInvoice.amountPaid, updatedInvoice.amountToPay);
                    should.equal(updatedInvoice.payerList.length, 1);
                    should.equal(updatedInvoice.payerList[0].paymentList.length, 2);
                    should.exist(updatedInvoice.payerList[0].paymentList[1].transactionId);

                    invoice = updatedInvoice;
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });

        it("Should mark the invoice as Paid", function (done) {
            invoice.paymentStatus = InvoicePaymentStatus.Paid;

            let saveInvoice = new SaveInvoice(testContext.appContext, testContext.sessionContext);
            saveInvoice.save(invoice)
                .then((updatedInvoice: InvoiceDO) => {
                    should.equal(updatedInvoice.paymentStatus, InvoicePaymentStatus.Paid);
                    should.exist(updatedInvoice.paidTimestamp);

                    invoice = updatedInvoice;
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });

    });

});
