import * as _ from "underscore";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi, ThError } from "../../../../../common/utils/AppContext";
import { InvoiceDO, InvoicePaymentStatus } from "../../invoices/data-objects/InvoiceDO";
import { InvoicesDO } from "../../invoices/data-objects/InvoicesDO";
import { InvoicePaymentDO } from "../../invoices/data-objects/payer/InvoicePaymentDO";
import { InvoiceItemDO } from "../../invoices/data-objects/items/InvoiceItemDO";
import { InvoicePayerDO } from "../../invoices/data-objects/payer/InvoicePayerDO";

@Injectable()
export class HotelOperationsInvoiceService {

    constructor(private context: AppContext) { }

    getInvoicesByGroup(groupId: string): Observable<InvoiceDO[]> {
        if (this.context.thUtils.isUndefinedOrNull(groupId)) {
            let msg = this.context.thTranslation.translate("Could not find invoices. Empty group provided.");
            return Observable.throw(new ThError(msg));
        }
        return this.getInvoices({ groupId: groupId });
    }

    getDefaultInvoiceForBooking(bookingId: string): Observable<InvoiceDO> {
        return this.getInvoicesForBooking(bookingId)
            .map((invoiceList: InvoiceDO[]) => {
                if (invoiceList.length == 0) {
                    return null;
                }
                let unpaidInvoice = _.find(invoiceList, (invoice: InvoiceDO) => {
                    return invoice.isUnpaid();
                });
                if (!this.context.thUtils.isUndefinedOrNull(unpaidInvoice)) {
                    return unpaidInvoice;
                }
                return invoiceList[0];
            });
    }

    getInvoicesForBooking(bookingId: string): Observable<InvoiceDO[]> {
        if (this.context.thUtils.isUndefinedOrNull(bookingId)) {
            let msg = this.context.thTranslation.translate("Could not find invoices. Empty booking provided.");
            return Observable.throw(new ThError(msg));
        }
        return this.getInvoices({ bookingId: bookingId });
    }

    get(id: string): Observable<InvoiceDO> {
        return this.context.thHttp.get({
            serverApi: ThServerApi.InvoicesItem,
            queryParameters: {
                id: id
            }
        }).map((invoiceObject: Object) => {
            return this.convertInvoice(invoiceObject);
        });
    }

    addPayer(invoice: InvoiceDO, customerId: string): Observable<InvoiceDO> {
        let payer: InvoicePayerDO = _.find(invoice.payerList, (payer: InvoicePayerDO) => {
            return payer.customerId == customerId;
        });
        if (!this.context.thUtils.isUndefinedOrNull(payer)) {
            let msg = this.context.thTranslation.translate("The payer is already added on the invoice");
            return Observable.throw(new ThError(msg));
        }
        let customerPayerDO = new InvoicePayerDO();
        customerPayerDO.customerId = customerId;
        invoice.payerList.push(customerPayerDO);
        return this.runHttpPostActionOnInvoice(ThServerApi.InvoicesSave, { invoice: invoice });
    }

    removePayer(invoice: InvoiceDO, customerId: string): Observable<InvoiceDO> {
        let payer: InvoicePayerDO = _.find(invoice.payerList, (payer: InvoicePayerDO) => {
            return payer.customerId == customerId;
        });
        if (this.context.thUtils.isUndefinedOrNull(payer)) {
            let msg = this.context.thTranslation.translate("The payer was not found on the invoice");
            return Observable.throw(new ThError(msg));
        }
        if (_.isArray(payer.paymentList) && payer.paymentList.length > 0) {
            let msg = this.context.thTranslation.translate("You cannot remove this payer because there is at least one payment referencing him.");
            return Observable.throw(new ThError(msg));
        }
        return this.runHttpPostActionOnInvoice(ThServerApi.InvoicesSave, { invoice: invoice, payerCustomerIdListToDelete: [customerId] });
    }

    addItem(invoice: InvoiceDO, item: InvoiceItemDO): Observable<InvoiceDO> {
        // ensure that the item is not already stamped
        delete item.transactionId;
        delete item.timestamp;
        invoice.itemList.push(item);

        return this.runHttpPostActionOnInvoice(ThServerApi.InvoicesSave, { invoice: invoice });
    }
    removeItem(invoice: InvoiceDO, itemTransactionId: string): Observable<InvoiceDO> {
        let item: InvoiceItemDO = _.find(invoice.itemList, (item: InvoiceItemDO) => {
            return item.transactionId == itemTransactionId;
        });
        if (this.context.thUtils.isUndefinedOrNull(item)) {
            let msg = this.context.thTranslation.translate("The item was not found on the invoice");
            return Observable.throw(new ThError(msg));
        }
        return this.runHttpPostActionOnInvoice(ThServerApi.InvoicesSave, { invoice: invoice, itemTransactionIdListToDelete: [itemTransactionId] });
    }

    addPayment(invoice: InvoiceDO, customerId: string, payment: InvoicePaymentDO): Observable<InvoiceDO> {
        let payerIndex: number = _.findIndex(invoice.payerList, ((p: InvoicePayerDO) => {
            return p.customerId === customerId;
        }));
        if (payerIndex == -1) {
            let msg = this.context.thTranslation.translate("The payer was not found on the invoice");
            return Observable.throw(new ThError(msg));
        }

        // ensure that the payment is not already stamped
        delete payment.timestamp;
        delete payment.transactionId;

        invoice.payerList[payerIndex].paymentList.push(payment);
        return this.runHttpPostActionOnInvoice(ThServerApi.InvoicesSave, { invoice: invoice });
    }
    markAsPaid(invoice: InvoiceDO): Observable<InvoiceDO> {
        invoice.paymentStatus = InvoicePaymentStatus.Paid;
        return this.runHttpPostActionOnInvoice(ThServerApi.InvoicesSave, { invoice: invoice });
    }
    markAsLossByManagemnt(invoice: InvoiceDO): Observable<InvoiceDO> {
        invoice.paymentStatus = InvoicePaymentStatus.LossAcceptedByManagement;
        return this.runHttpPostActionOnInvoice(ThServerApi.InvoicesSave, { invoice: invoice });
    }

    private getInvoices(searchCriteria: Object): Observable<InvoiceDO[]> {
        return this.context.thHttp.post({
            serverApi: ThServerApi.Invoices,
            body: JSON.stringify({ searchCriteria: searchCriteria })
        }).map((resultObject: Object) => {
            var invoices = new InvoicesDO();
            invoices.buildFromObject(resultObject);
            return invoices.invoiceList;
        });
    }
    private runHttpPostActionOnInvoice(apiAction: ThServerApi, postData: Object): Observable<InvoiceDO> {
        return this.context.thHttp.post({
            serverApi: apiAction,
            body: JSON.stringify(postData)
        }).map((result: Object) => {
            return this.convertInvoice(result["invoice"]);
        });
    }
    private convertInvoice(invoiceObject): InvoiceDO {
        var invoice = new InvoiceDO();
        invoice.buildFromObject(invoiceObject);
        return invoice;
    }
}
