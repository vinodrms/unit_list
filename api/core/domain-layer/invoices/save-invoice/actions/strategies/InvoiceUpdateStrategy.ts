import _ = require("underscore");
import { AInvoiceStrategy } from "./AInvoiceStrategy";
import { InvoiceDO, InvoicePaymentStatus, InvoiceAccountingType } from "../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { ThError } from "../../../../../utils/th-responses/ThError";
import { ThStatusCode } from "../../../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../../../utils/logging/ThLogger";
import { SessionContext } from "../../../../../utils/SessionContext";
import { AppContext } from "../../../../../utils/AppContext";
import { InvoiceItemDO, InvoiceItemType } from "../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { InvoicePayerDO } from "../../../../../data-layer/invoices/data-objects/payer/InvoicePayerDO";
import { InvoicePaymentDO } from "../../../../../data-layer/invoices/data-objects/payer/InvoicePaymentDO";

export class InvoiceUpdateStrategy extends AInvoiceStrategy {

    constructor(appContext: AppContext, sessionContext: SessionContext,
        invoiceToSave: InvoiceDO,
        private itemTransactionIdListToDelete: string[],
        private payerCustomerIdListToDelete: string[]) {
        super(appContext, sessionContext, invoiceToSave);
    }

    saveInvoice(resolve: (result: InvoiceDO) => void, reject: (err: ThError) => void) {
        let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepo.getInvoiceById({ hotelId: this.hotelId }, this.invoiceToSave.id)
            .then((existingInvoice: InvoiceDO) => {
                this.updateAttributesOn(existingInvoice);

                let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
                return invoiceRepo.updateInvoice({ hotelId: this.hotelId },
                    { id: existingInvoice.id, versionId: existingInvoice.versionId }, existingInvoice);
            }).then((updatedInvoice: InvoiceDO) => {
                resolve(updatedInvoice);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingInvoiceUpdateStrategyErrorUpdating, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error updating invoice", this.invoiceToSave, thError);
                }
                reject(thError);
            });
    }

    private updateAttributesOn(existingInvoice: InvoiceDO) {
        // paid invoices will always remain as they are
        if (existingInvoice.paymentStatus == InvoicePaymentStatus.Paid) {
            return;
        }
        // loss by management invoices can only be marked as Paid
        if (existingInvoice.paymentStatus == InvoicePaymentStatus.LossAcceptedByManagement) {
            if (this.invoiceToSave.paymentStatus == InvoicePaymentStatus.Paid) {
                this.checkAmountsEqualityOn(existingInvoice);
                existingInvoice.paymentStatus = InvoicePaymentStatus.Paid;
            }
            this.addNewPayersOn(existingInvoice);
            this.addNewPaymentsOn(existingInvoice);
            this.updatePayerNotesOn(existingInvoice);
            this.deletePayersFrom(existingInvoice);
            this.translateInvoiceHistoryOn(existingInvoice);
            existingInvoice.recomputePrices();
            return;
        }
        // otherwise the existing invoice is unpaid
        existingInvoice.paymentStatus = this.invoiceToSave.paymentStatus;

        this.deleteItemsFrom(existingInvoice);
        this.addNewItemsOn(existingInvoice);
        this.addNewPayersOn(existingInvoice);
        this.addNewPaymentsOn(existingInvoice);
        this.updatePayerNotesOn(existingInvoice);
        this.deletePayersFrom(existingInvoice);
        this.translateInvoiceHistoryOn(existingInvoice);
        existingInvoice.recomputePrices();

        // Only close the invoice if
        //  1. The amount to pay is the same with the paid amount
        //  2. There is at least one item on the invoice
        if (existingInvoice.isClosed()) {
            if (existingInvoice.isPaid()) {
                this.checkAmountsEqualityOn(existingInvoice);
            }
            if (existingInvoice.itemList.length == 0) {
                var thError = new ThError(ThStatusCode.SaveInvoiceCannotCloseInvoiceWithNoItems, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "cannot close an invoice with no items on it",
                    this.invoiceToSave, thError);
                throw thError;
            }
        }
    }
    private translateInvoiceHistoryOn(existingInvoice: InvoiceDO) {
        existingInvoice.history.translateActions(this.appContext.thTranslate);
    }
    private updatePayerNotesOn(existingInvoice: InvoiceDO) {
        this.invoiceToSave.payerList.forEach((payer: InvoicePayerDO) => {
            if (!this.thUtils.isUndefinedOrNull(payer.notes)) {
                let payerIndex: number = _.findIndex(existingInvoice.payerList, ((p: InvoicePayerDO) => { return p.customerId === payer.customerId; }));
                existingInvoice.payerList[payerIndex].notes = payer.notes;
            }
        });
    }
    private checkAmountsEqualityOn(existingInvoice: InvoiceDO) {
        if (existingInvoice.amountPaid != existingInvoice.amountToPay) {
            var thError = new ThError(ThStatusCode.SaveInvoiceAmountsNotMatching, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "cannot close an invoice on which the amount to pay is not equal with the paid amount",
                this.invoiceToSave, thError);
            throw thError;
        }
    }

    private deleteItemsFrom(existingInvoice: InvoiceDO) {
        let itemsToRemove = existingInvoice.itemList.filter((existingItem: InvoiceItemDO) => {
            return _.contains(this.itemTransactionIdListToDelete, existingItem.transactionId);
        });
        itemsToRemove.forEach((item: InvoiceItemDO) => {
            if (item.type === InvoiceItemType.Booking) {
                var thError = new ThError(ThStatusCode.SaveInvoiceCannotRemoveBookingItem, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "cannot remove booking items from invoices",
                    this.invoiceToSave, thError);
                throw thError;
            }
        });

        existingInvoice.itemList = existingInvoice.itemList
            .filter((existingItem: InvoiceItemDO) => {
                return !_.contains(this.itemTransactionIdListToDelete, existingItem.transactionId);
            });
    }
    private addNewItemsOn(existingInvoice: InvoiceDO) {
        let newItems = this.invoiceToSave.itemList.filter((item: InvoiceItemDO) => {
            return this.thUtils.isUndefinedOrNull(item.transactionId)
                && !item.meta.isDerivedFromBooking();
        });
        newItems.forEach((item: InvoiceItemDO) => {
            this.stampItem(item);
        });
        existingInvoice.itemList = existingInvoice.itemList.concat(newItems);
    }

    private addNewPayersOn(existingInvoice: InvoiceDO) {
        this.invoiceToSave.payerList.forEach((payer: InvoicePayerDO) => {
            let payerIndex: number = _.findIndex(existingInvoice.payerList, ((p: InvoicePayerDO) => { return p.customerId === payer.customerId; }));
            if (payerIndex < 0) {
                let newPayer = new InvoicePayerDO();
                newPayer.customerId = payer.customerId;
                newPayer.paymentList = [];
                existingInvoice.payerList.push(newPayer);
            }
        });
    }

    private addNewPaymentsOn(existingInvoice: InvoiceDO) {
        this.invoiceToSave.payerList.forEach((payer: InvoicePayerDO) => {
            payer.paymentList.forEach((payment: InvoicePaymentDO) => {
                // if the payment has no transactionId then it's a new payment
                if (this.thUtils.isUndefinedOrNull(payment.transactionId)) {
                    payment.amount = this.appContext.thUtils.roundNumberToTwoDecimals(payment.amount);
                    payment.amountPlusTransactionFee = this.appContext.thUtils.roundNumberToTwoDecimals(payment.amountPlusTransactionFee);
                    this.ensurePayerExistsOn(payer.customerId, existingInvoice);
                    this.stampPayment(payment);
                    let payerIndex: number = _.findIndex(existingInvoice.payerList, ((p: InvoicePayerDO) => { return p.customerId === payer.customerId; }));
                    existingInvoice.payerList[payerIndex].paymentList.push(payment);
                }
            });
        });
    }
    private ensurePayerExistsOn(payerCustomerId: string, existingInvoice: InvoiceDO) {
        let existingPayer: InvoicePayerDO = _.find(existingInvoice.payerList, (payer: InvoicePayerDO) => {
            return payer.customerId === payerCustomerId;
        });
        // if the payer does not exist we append him to the list
        if (this.thUtils.isUndefinedOrNull(existingPayer)) {
            var newPayer = new InvoicePayerDO();
            newPayer.customerId = payerCustomerId;
            newPayer.paymentList = [];
            existingInvoice.payerList.push(newPayer);
        }
    }

    private deletePayersFrom(existingInvoice: InvoiceDO) {
        let payerListToDelete = existingInvoice.payerList.filter((payer: InvoicePayerDO) => {
            return _.contains(this.payerCustomerIdListToDelete, payer.customerId);
        });
        // do not change with forEach because we'll loose the ThError's context !
        for (var i = 0; i < payerListToDelete.length; i++) {
            let payerToDelete: InvoicePayerDO = payerListToDelete[i];
            if (payerToDelete.paymentList.length > 0) {
                var thError = new ThError(ThStatusCode.SaveInvoiceCannotDeletePayerWithPayments, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "cannot delete payer with existing payment on invoice", this.invoiceToSave, thError);
                throw thError;
            }
            existingInvoice.payerList = existingInvoice.payerList.filter((payer: InvoicePayerDO) => {
                return payer.customerId != payerToDelete.customerId;
            });
        }
    }
}
