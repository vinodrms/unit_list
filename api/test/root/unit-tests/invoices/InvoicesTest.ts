require("sails-test-helper");
import should = require('should');
import supertest = require('supertest');
import _ = require('underscore');
import { TestUtils } from "../../../helpers/TestUtils";
import { TestContext } from "../../../helpers/TestContext";
import { DefaultDataBuilder } from "../../../db-initializers/DefaultDataBuilder";
import { InvoiceDO, InvoicePaymentStatus, InvoiceStatus } from "../../../../core/data-layer/invoices/data-objects/InvoiceDO";
import { InvoicePayerDO } from "../../../../core/data-layer/invoices/data-objects/payer/InvoicePayerDO";
import { CustomerDO } from "../../../../core/data-layer/customers/data-objects/CustomerDO";
import { SaveInvoice } from "../../../../core/domain-layer/invoices/save-invoice/SaveInvoice";
import { ThError } from "../../../../core/utils/th-responses/ThError";
import { InvoicesTestHelper } from "./helpers/InvoicesTestHelper";
import { InvoiceSearchResultRepoDO } from "../../../../core/data-layer/invoices/repositories/IInvoiceRepository";
import { TransferInvoiceItems } from "../../../../core/domain-layer/invoices/transfer-items/TransferInvoiceItems";
import { TransferInvoiceItemsDO } from "../../../../core/domain-layer/invoices/transfer-items/TransferInvoiceItemsDO";
import { InvoiceItemDO, InvoiceItemType } from "../../../../core/data-layer/invoices/data-objects/items/InvoiceItemDO";
import { ReinstateInvoice } from "../../../../core/domain-layer/invoices/reinstate-invoice/ReinstateInvoice";
import { ThStatusCode } from "../../../../core/utils/th-responses/ThResponse";
import { DeleteInvoice } from "../../../../core/domain-layer/invoices/delete-invoice/DeleteInvoice";

describe("Invoices Tests", function () {
    var testUtils: TestUtils;
    var testContext: TestContext;
    var testDataBuilder: DefaultDataBuilder;
    var helper: InvoicesTestHelper;

    var invoice: InvoiceDO;
    var walkInInvoice: InvoiceDO;
    var bookingInvoice: InvoiceDO;

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
            paidAmount = testContext.appContext.thUtils.roundNumberToTwoDecimals(paidAmount);
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

        it("Should reinstate the invoice by generating a credit and another unpaid invoice", function (done) {
            let reinstateInvoice = new ReinstateInvoice(testContext.appContext, testContext.sessionContext);
            reinstateInvoice.reinstate(invoice.id)
                .then((invoices: InvoiceDO[]) => {
                    should.equal(invoices.length, 2);
                    let credit: InvoiceDO = _.find(invoices, (i: InvoiceDO) => { return i.paymentStatus === InvoicePaymentStatus​​.Credit });
                    should.exist(credit);
                    let reinstatement: InvoiceDO = _.find(invoices, (i: InvoiceDO) => { return i.paymentStatus === InvoicePaymentStatus​​.Unpaid });
                    should.exist(reinstatement);

                    should.equal(reinstatement.reference.startsWith("TEMP"), true);
                    should.equal(_.isNumber(reinstatement.paidTimestamp), false);
                    should.equal(credit.reference, invoice.reference);
                    should.equal(_.isNumber(credit.paidTimestamp), true);

                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });
        it("Should not reinstate the same invoice more than once", function (done) {
            let reinstateInvoice = new ReinstateInvoice(testContext.appContext, testContext.sessionContext);
            reinstateInvoice.reinstate(invoice.id)
                .then((invoices: InvoiceDO[]) => {
                    done(new Error("Managed to reinstate the same Paid invoice more than once!"));
                }).catch((e: ThError) => {
                    should.equal(e.getThStatusCode(), ThStatusCode.ReinstateInvoiceCreditExists);
                    done();
                });
        });
        it("Should delete an invoice", function (done) {
            let invoiceToDelete = helper.getUnpaidInvoiceWithNoItems();
            let deleteInvoice = new DeleteInvoice(testContext.appContext, testContext.sessionContext);
            deleteInvoice.delete(invoiceToDelete.id)
                .then((updatedInvoice: InvoiceDO) => {
                    should.equal(updatedInvoice.status, InvoiceStatus.Deleted);
                    done();
                }).catch((e: ThError) => {
                    done(e);
                });
        });
    });

    describe("Invoice transfer tests", function () {
        it("Should transfer an AddOnProduct item from an invoice to another", function (done) {
            let source = helper.getUnpaidWalkInInvoice();
            let item: InvoiceItemDO = source.itemList[0];
            let destination = helper.getUnpaidBookingInvoice();

            let transferInvoiceItems = new TransferInvoiceItems(testContext.appContext, testContext.sessionContext);
            let params = new TransferInvoiceItemsDO();
            params.transfers = [
                {
                    sourceInvoiceId: source.id,
                    destinationInvoiceId: destination.id,
                    transactionId: item.transactionId
                }
            ];
            transferInvoiceItems.transfer(params).then((updatedInvoices: InvoiceDO[]) => {
                should.equal(updatedInvoices.length, 2);

                let updatedSource: InvoiceDO = _.find(updatedInvoices, i => { return i.id === source.id });
                should.exist(updatedSource);

                let updatedDestination: InvoiceDO = _.find(updatedInvoices, i => { return i.id === destination.id });
                should.exist(updatedDestination);

                should.equal(source.itemList.length, updatedSource.itemList.length + 1);
                should.equal(source.amountToPay,
                    testContext.appContext.thUtils.roundNumberToTwoDecimals(updatedSource.amountToPay + item.getTotalPrice()));

                should.equal(destination.itemList.length, updatedDestination.itemList.length - 1);
                should.equal(testContext.appContext.thUtils.roundNumberToTwoDecimals(destination.amountToPay + item.getTotalPrice()),
                    updatedDestination.amountToPay);

                walkInInvoice = updatedSource;
                bookingInvoice = updatedDestination;

                done();
            }).catch((e: ThError) => {
                done(e);
            });
        });
        it("Should transfer a Booking with its child items from an invoice to another", function (done) {
            let source = bookingInvoice;
            let destination = walkInInvoice;

            let item: InvoiceItemDO = _.find(source.itemList, (i: InvoiceItemDO) => { return i.type === InvoiceItemType​.​Booking; });
            should.exist(item);
            let relatedItems: InvoiceItemDO[] = _.filter(source.itemList, (i: InvoiceItemDO) => { return i.parentTransactionId === item.transactionId; });
            should.equal(relatedItems.length > 0, true);

            let transferInvoiceItems = new TransferInvoiceItems(testContext.appContext, testContext.sessionContext);
            let params = new TransferInvoiceItemsDO();
            params.transfers = [
                {
                    sourceInvoiceId: source.id,
                    destinationInvoiceId: destination.id,
                    transactionId: item.transactionId
                }
            ];
            transferInvoiceItems.transfer(params).then((updatedInvoices: InvoiceDO[]) => {
                should.equal(updatedInvoices.length, 2);

                let updatedSource: InvoiceDO = _.find(updatedInvoices, i => { return i.id === source.id });
                should.exist(updatedSource);

                let updatedDestination: InvoiceDO = _.find(updatedInvoices, i => { return i.id === destination.id });
                should.exist(updatedDestination);

                should.equal(source.itemList.length, updatedSource.itemList.length + 1 + relatedItems.length);
                should.equal(source.amountToPay,
                    testContext.appContext.thUtils.roundNumberToTwoDecimals(updatedSource.amountToPay + item.getTotalPrice() + helper.getTotalPrice(relatedItems)));

                should.equal(destination.itemList.length, updatedDestination.itemList.length - 1 - relatedItems.length);
                should.equal(testContext.appContext.thUtils.roundNumberToTwoDecimals(destination.amountToPay + item.getTotalPrice() + helper.getTotalPrice(relatedItems)),
                    updatedDestination.amountToPay);

                walkInInvoice = updatedSource;
                bookingInvoice = updatedDestination;

                done();
            }).catch((e: ThError) => {
                done(e);
            });
        });
    });

});
