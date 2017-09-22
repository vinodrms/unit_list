import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppContext, ThError } from "../../../../../../../../../../../../../common/utils/AppContext";
import { ThUtils } from "../../../../../../../../../../../../../common/utils/ThUtils";
import { InvoiceVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceVM";
import { CustomerDO } from "../../../../../../../../../../../services/customers/data-objects/CustomerDO";
import { InvoiceOperationsPageData } from "../../utils/InvoiceOperationsPageData";
import { InvoiceItemDO } from "../../../../../../../../../../../services/invoices/data-objects/items/InvoiceItemDO";
import { ModalDialogRef } from "../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { InvoiceDO } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { InvoiceSelectionModalService } from "../../../../../../../../../../common/inventory/modals/invoices/services/InvoiceSelectionModalService";
import { InvoicesDO } from "../../../../../../../../../../../services/invoices/data-objects/InvoicesDO";
import { InvoiceVMHelper } from "../../../../../../../../../../../services/invoices/view-models/utils/InvoiceVMHelper";
import { HotelOperationsInvoiceService, Transfer } from "../../../../../../../../../../../services/hotel-operations/invoice/HotelOperationsInvoiceService";
import { InvoiceItemVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceItemVM";

import _ = require('underscore');


@Component({
    selector: 'invoice-transfer',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-transfer/template/invoice-transfer.html',
    providers: [InvoiceSelectionModalService, InvoiceVMHelper, HotelOperationsInvoiceService]
})
export class InvoiceTransferComponent implements OnInit {

    @Input() relatedInvoices: InvoiceVM[];
    @Input() invoiceOperationsPageData: InvoiceOperationsPageData;
    @Input() currentRelatedInvoiceIndex: number;
    @Output() backToInvoiceOverviewClicked = new EventEmitter();

    private _thUtils: ThUtils;
    private transferInProgress: boolean;

    transferInvoice: InvoiceVM;
    transfers: Transfer[];

    constructor(private _appContext: AppContext,
        private _invoiceVMHelper: InvoiceVMHelper,
        private _invoiceSelectionModalService: InvoiceSelectionModalService,
        private _invoiceOperations: HotelOperationsInvoiceService) {
        this._thUtils = new ThUtils();
        this.transfers = [];
        this.transferInProgress = false;
    }

    ngOnInit() {
    }

    public get currentInvoice(): InvoiceVM {
        return this.relatedInvoices[this.currentRelatedInvoiceIndex];
    }

    public get payerList(): CustomerDO[] {
        return this.currentInvoice.customerList;
    }

    public backToInvoiceOverview() {
        this.backToInvoiceOverviewClicked.emit();
    }

    public isInvoiceSelectedForTransfer(): boolean {
        return !this._thUtils.isUndefinedOrNull(this.transferInvoice);
    }

    public openInvoiceSelectionModal() {
        this._invoiceSelectionModalService.openInvoiceSelectionModal(false, true, this.currentInvoice.invoice.id).then((modalDialogInstance: ModalDialogRef<InvoiceDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedInvoiceList: InvoiceDO[]) => {
                var invoicesDO: InvoicesDO = new InvoicesDO();
                invoicesDO.invoiceList = [selectedInvoiceList[0]];
                this._invoiceVMHelper.convertToViewModels(invoicesDO).subscribe((invoiceVMList: InvoiceVM[]) => {
                    this.transferInvoice = invoiceVMList[0];
                });
            });
        }).catch((e: any) => { });
    }

    public get ccySymbol(): string {
        return this.invoiceOperationsPageData.ccy.symbol;
    }

    public getDisplayName(item: InvoiceItemDO): string {
        return item.meta.getDisplayName(this._appContext.thTranslation);
    }

    private transferItems() {
        if (this.transfers.length == 0 || this.transferInProgress) { return; }
        this.transferInProgress = true;
        this._invoiceOperations.transfer(this.transfers)
            .subscribe((invoices: InvoiceDO[]) => {
                this.currentInvoice.invoice = invoices[0];
                this.transferInvoice.invoice = invoices[1];
                this.transfers = [];
                this.transferInProgress = false;
                let message = this._appContext.thTranslation.translate("Items moved succesfully");
                this._appContext.toaster.success(message);
            }, (error: ThError) => {
                this.transferInProgress = false;
                this._appContext.toaster.error(error.message);
            });
    }

    public transferItemsToRight(item: InvoiceItemDO) {
        if (this._thUtils.isUndefinedOrNull(this.transferInvoice)) {
            return;
        }
        var itemsToTransfer = _.filter(this.currentInvoice.invoice.itemList, (invoiceItem: InvoiceItemDO) => { return item.transactionId === invoiceItem.transactionId || item.transactionId === invoiceItem.parentTransactionId });
        this.transferInvoice.invoice.itemList = this.transferInvoice.invoice.itemList.concat(itemsToTransfer);
        this.currentInvoice.invoice.itemList = _.filter(this.currentInvoice.invoice.itemList, (invoiceItem: InvoiceItemDO) => {
            return !_.contains(itemsToTransfer, invoiceItem);
        });
        this.transferInvoice.recreateInvoiceItemVms();
        this.currentInvoice.recreateInvoiceItemVms();
        this.updateTransfers(this.currentInvoice.invoice.id, this.transferInvoice.invoice.id, item.transactionId);
    }

    public transferItemsToLeft(item: InvoiceItemDO) {
        if (this._thUtils.isUndefinedOrNull(this.transferInvoice)) {
            return;
        }
        var itemsToTransfer = _.filter(this.transferInvoice.invoice.itemList, (invoiceItem: InvoiceItemDO) => { return item.transactionId === invoiceItem.transactionId || item.transactionId === invoiceItem.parentTransactionId });
        this.currentInvoice.invoice.itemList = this.currentInvoice.invoice.itemList.concat(itemsToTransfer);
        this.transferInvoice.invoice.itemList = _.filter(this.transferInvoice.invoice.itemList, (invoiceItem: InvoiceItemDO) => {
            return !_.contains(itemsToTransfer, invoiceItem);
        });
        this.transferInvoice.recreateInvoiceItemVms();
        this.currentInvoice.recreateInvoiceItemVms();
        this.updateTransfers(this.transferInvoice.invoice.id, this.currentInvoice.invoice.id, item.transactionId);
    }

    private updateTransfers(sourceInvoiceId: string, destinationInvoiceId: string, transactionId: string) {
        var existingTransfer = _.find(this.transfers, (transfer: Transfer) => {
            return transfer.sourceInvoiceId === destinationInvoiceId
                && transfer.destinationInvoiceId === sourceInvoiceId
                && transfer.transactionId === transactionId;
        });
        if (!this._thUtils.isUndefinedOrNull(existingTransfer)) {
            this.transfers = _.without(this.transfers, existingTransfer);
            return;
        }
        this.transfers.push({ sourceInvoiceId, destinationInvoiceId, transactionId });
    }

    public isTransferedItem(item: InvoiceItemDO): boolean {
        return !this._thUtils.isUndefinedOrNull(_.find(this.transfers, (transfer: Transfer) => {
            return (transfer.transactionId === item.transactionId) || (transfer.transactionId === item.parentTransactionId);
        }));
    }

    public itemHasParentTransactionId(item: InvoiceItemDO): boolean {
        return !this._thUtils.isUndefinedOrNull(item.parentTransactionId);
    }

    public getInvoiceItemDisplayName(itemVm: InvoiceItemVM): string {
        return itemVm.getDisplayName(this._appContext.thTranslation);
    }

    public hasAtLeastOneTransientTransfer(): boolean {
        return this.transfers.length > 0;
    }

    public get transferInvoiceTransientAmountToPay(): number {
        var amountToPay = _.reduce(this.transferInvoice.invoice.itemList, function (sum, item: InvoiceItemDO) {
            return sum + item.meta.getTotalPrice();
        }, 0);
        amountToPay = this._thUtils.roundNumberToTwoDecimals(amountToPay);
        return amountToPay;
    }

    public get currentInvoiceTransientAmountToPay(): number {
        var amountToPay = _.reduce(this.currentInvoice.invoice.itemList, function (sum, item: InvoiceItemDO) {
            return sum + item.meta.getTotalPrice();
        }, 0);
        amountToPay = this._thUtils.roundNumberToTwoDecimals(amountToPay);
        return amountToPay;
    }
}
