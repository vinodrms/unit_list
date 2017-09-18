import _ = require('underscore');
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { TransferInvoiceItemsDO, Transfer } from "./TransferInvoiceItemsDO";
import { InvoiceDO, InvoicePaymentStatus } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { ThError } from "../../../utils/th-responses/ThError";
import { ValidationResultParser } from "../../common/ValidationResultParser";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../utils/logging/ThLogger";
import { InvoiceSearchResultRepoDO } from "../../../data-layer/invoices/repositories/IInvoiceRepository";
import { InvoiceItemDO } from "../../../data-layer/invoices/data-objects/items/InvoiceItemDO";

export class TransferInvoiceItems {
    private static noSupportedInvoices = 2;

    private input: TransferInvoiceItemsDO;
    private invoices: InvoiceDO[];
    private invoicesById: { [index: string]: InvoiceDO };

    constructor(private appContext: AppContext, private sessionContext: SessionContext) {
    }

    public transfer(input: TransferInvoiceItemsDO): Promise<InvoiceDO[]> {
        this.input = input;
        return new Promise<InvoiceDO[]>((resolve: { (result: InvoiceDO[]): void }, reject: { (err: ThError): void }) => {
            this.transferCore(resolve, reject);
        });
    }

    private transferCore(resolve: { (result: InvoiceDO[]): void }, reject: { (err: ThError): void }) {
        var validationResult = TransferInvoiceItemsDO.getValidationStructure().validateStructure(this.input);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this.input);
            parser.logAndReject("Error validating data for Transfer Invoice Items", reject);
            return;
        }

        let invoiceIds = this.getInvoiceIds();
        if (invoiceIds.length != TransferInvoiceItems.noSupportedInvoices) {
            var thError = new ThError(ThStatusCode.TransferInvoiceItemsTwoInvoicesRequired, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "tried to transfer items between " +
                invoiceIds.length + " invoices", this.input, thError);
            reject(thError);
            return;
        }

        let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepo.getInvoiceList({ hotelId: this.sessionContext.sessionDO.hotel.id }, {
            invoicePaymentStatus: InvoicePaymentStatus.Unpaid,
            invoiceIdList: invoiceIds
        }).then((result: InvoiceSearchResultRepoDO) => {
            this.invoices = result.invoiceList;
            this.invoicesById = _.indexBy(this.invoices, (invoice: InvoiceDO) => { return invoice.id });

            if (this.invoices.length != TransferInvoiceItems.noSupportedInvoices) {
                var thError = new ThError(ThStatusCode.TransferInvoiceItemsUnpaidInvoicesNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "invoices for transfer not found", this.input, thError);
                throw thError;
            }
            return this.addItemsToTheirDestinations();
        }).then((updatedInvoices: InvoiceDO[]) => {
            this.updateInvoices(updatedInvoices);
            return this.removeItemsFromTheirSources();
        }).then((updatedInvoices: InvoiceDO[]) => {
            this.updateInvoices(updatedInvoices);
            resolve(this.invoices);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.TransferInvoiceItemsError, error);
            ThLogger.getInstance().logError(ThLogLevel.Error, "error transferring items", this.input, thError);
            reject(thError);
        });
    }

    private addItemsToTheirDestinations(): Promise<InvoiceDO[]> {
        let invoiceIdsToUpdate: string[] = [];
        for (var i = 0; i < this.input.transfers.length; i++) {
            let transfer = this.input.transfers[i];

            let source = this.invoicesById[transfer.sourceInvoiceId];
            let item: InvoiceItemDO = _.find(source.itemList, (item: InvoiceItemDO) => {
                return item.transactionId === transfer.transactionId;
            });
            if (this.appContext.thUtils.isUndefinedOrNull(item)) {
                var thError = new ThError(ThStatusCode.TransferInvoiceItemsItemNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "item not found", this.input, thError);
                throw thError;
            }
            if (!this.appContext.thUtils.isUndefinedOrNull(item.parentTransactionId)) {
                var thError = new ThError(ThStatusCode.TransferInvoiceItemsLinkedItemsCannotBeMoved, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "tried to move an item with parent", this.input, thError);
                throw thError;
            }
            let linkedItems: InvoiceItemDO[] = _.filter(source.itemList, (item: InvoiceItemDO) => {
                return item.parentTransactionId === transfer.transactionId;
            });
            let destination = this.invoicesById[transfer.destinationInvoiceId];
            destination.itemList.push(item);
            destination.itemList = destination.itemList.concat(linkedItems);
            destination.recomputePrices();
            invoiceIdsToUpdate.push(destination.id);
        }
        return this.updateInvoicesByIds(invoiceIdsToUpdate);
    }

    private removeItemsFromTheirSources(): Promise<InvoiceDO[]> {
        let invoiceIdsToUpdate: string[] = [];

        this.input.transfers.forEach((transfer: Transfer) => {
            let source = this.invoicesById[transfer.sourceInvoiceId];
            source.itemList = _.filter(source.itemList, (item: InvoiceItemDO) => {
                return item.transactionId != transfer.transactionId
                    && item.parentTransactionId != transfer.transactionId;
            });
            source.recomputePrices();
            invoiceIdsToUpdate.push(source.id);
        });
        return this.updateInvoicesByIds(invoiceIdsToUpdate);
    }
    private updateInvoicesByIds(invoiceIdsToUpdate: string[]): Promise<InvoiceDO[]> {
        invoiceIdsToUpdate = _.uniq(invoiceIdsToUpdate);
        let promises: Promise<InvoiceDO>[] = [];
        invoiceIdsToUpdate.forEach(invoiceId => {
            let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
            let invoice = this.invoicesById[invoiceId];
            let promise = invoiceRepo.updateInvoice({ hotelId: this.sessionContext.sessionDO.hotel.id }, {
                id: invoice.id,
                versionId: invoice.versionId
            }, invoice);
            promises.push(promise);
        });
        return Promise.all(promises);
    }

    private getInvoiceIds(): string[] {
        var invoiceIds: string[] = [];
        this.input.transfers.forEach((t: Transfer) => {
            invoiceIds.push(t.sourceInvoiceId);
            invoiceIds.push(t.destinationInvoiceId);
        });
        invoiceIds = _.uniq(invoiceIds);
        return invoiceIds;
    }

    private updateInvoices(newInvoices: InvoiceDO[]) {
        newInvoices.forEach((newInvoice: InvoiceDO) => {
            var index = _.findIndex(this.invoices, (invoice: InvoiceDO) => {
                return invoice.id === newInvoice.id;
            });
            if (index >= 0) {
                this.invoices[index] = newInvoice;
                this.invoicesById[newInvoice.id] = newInvoice;
            }
        });
    }
}
