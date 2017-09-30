import _ = require('underscore');
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
import { HotelOperationsPageControllerService } from '../../../../services/HotelOperationsPageControllerService';
import { InvoiceMetaFactory } from '../../../../../../../../../../../services/invoices/data-objects/InvoiceMetaFactory';
import { InvoiceChangedOptions } from '../invoice-overview/InvoiceOverviewComponent';

@Component({
    selector: 'invoice-transfer',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-transfer/template/invoice-transfer.html',
    providers: [InvoiceSelectionModalService, InvoiceVMHelper, HotelOperationsInvoiceService]
})
export class InvoiceTransferComponent implements OnInit {

    @Input() relatedInvoices: InvoiceVM[];
    @Input() invoiceOperationsPageData: InvoiceOperationsPageData;
    @Input() currentRelatedInvoiceIndex: number;
    @Input() transferInvoiceId: string;
    @Output() backToInvoiceOverviewClicked = new EventEmitter();
    @Output() invoiceChanged = new EventEmitter<InvoiceChangedOptions>();

    private transferInProgress: boolean;
    private invoiceMetaFactory: InvoiceMetaFactory;
    private isLoading: boolean;

    transferInvoice: InvoiceVM;
    transfers: Transfer[];
    currentInvoice: InvoiceVM;

    constructor(private context: AppContext,
        private invoiceVMHelper: InvoiceVMHelper,
        private invoiceSelectionModalService: InvoiceSelectionModalService,
        private invoiceOperations: HotelOperationsInvoiceService,
        private operationsPageControllerService: HotelOperationsPageControllerService, ) {
        this.transfers = [];
        this.transferInProgress = false;
        this.invoiceMetaFactory = new InvoiceMetaFactory();
    }

    ngOnInit() {
        let invoiceVM = this.relatedInvoices[this.currentRelatedInvoiceIndex];

        var currentInvoice = new InvoiceVM();
        this.updateInvoiceOn(currentInvoice, invoiceVM.invoice);
        currentInvoice.customerList = invoiceVM.customerList;
        currentInvoice.recreateInvoiceItemVms();
        this.currentInvoice = currentInvoice;

        if (!this.context.thUtils.isUndefinedOrNull(this.transferInvoiceId)) {
            this.isLoading = true;
            this.invoiceOperations.get(this.transferInvoiceId).subscribe((invoice: InvoiceDO) => {
                var invoicesDO: InvoicesDO = new InvoicesDO();
                invoicesDO.invoiceList = [invoice];
                this.invoiceVMHelper.convertToViewModels(invoicesDO).subscribe((invoiceVMList: InvoiceVM[]) => {
                    this.transferInvoice = invoiceVMList[0];
                });
            }, (error: ThError) => {
                this.transferInProgress = false;
                this.context.toaster.error(error.message);
            }, () => {
                this.isLoading = false;
            });
        }
    }

    public get payerList(): CustomerDO[] {
        return this.currentInvoice.customerList;
    }

    public backToInvoiceOverview() {
        if (!this.hasAtLeastOneTransientTransfer()) {
            this.backToInvoiceOverviewClicked.emit();
            return;
        }
        var title = this.context.thTranslation.translate("Transfers");
        let content = this.context.thTranslation.translate("Are you sure you want to discard the transfers?");
        var positiveLabel = this.context.thTranslation.translate("Yes");
        var negativeLabel = this.context.thTranslation.translate("No");
        this.context.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
            this.backToInvoiceOverviewClicked.emit();
        });
    }

    public isInvoiceSelectedForTransfer(): boolean {
        return !this.context.thUtils.isUndefinedOrNull(this.transferInvoice);
    }

    public openInvoiceSelectionModal() {
        this.invoiceSelectionModalService.openInvoiceSelectionModal(false, true, this.currentInvoice.invoice.id).then((modalDialogInstance: ModalDialogRef<InvoiceDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedInvoiceList: InvoiceDO[]) => {
                var invoicesDO: InvoicesDO = new InvoicesDO();
                invoicesDO.invoiceList = [selectedInvoiceList[0]];
                this.invoiceVMHelper.convertToViewModels(invoicesDO).subscribe((invoiceVMList: InvoiceVM[]) => {
                    this.transferInvoice = invoiceVMList[0];
                });
            });
        }).catch((e: any) => { });
    }

    public get ccySymbol(): string {
        return this.invoiceOperationsPageData.ccy.symbol;
    }

    public getDisplayName(item: InvoiceItemDO): string {
        return item.meta.getDisplayName(this.context.thTranslation);
    }

    private transferItems() {
        if (this.transfers.length == 0 || this.transferInProgress) { return; }
        this.transferInProgress = true;

        let currentInvoiceId = this.currentInvoice.invoice.id;
        let transferInvoiceId = this.transferInvoice.invoice.id;

        this.invoiceOperations.transfer(this.transfers)
            .subscribe((invoices: InvoiceDO[]) => {
                this.currentInvoice.invoice = _.find(invoices, (invoice: InvoiceDO) => {
                    return invoice.id === currentInvoiceId;
                });
                this.updateInvoiceOn(this.relatedInvoices[this.currentRelatedInvoiceIndex], this.currentInvoice.invoice);

                this.transferInvoice.invoice = _.find(invoices, (invoice: InvoiceDO) => {
                    return invoice.id === transferInvoiceId;
                });
                this.transfers = [];
                this.transferInProgress = false;
                let message = this.context.thTranslation.translate("Items moved succesfully");
                this.context.toaster.success(message);
                this.context.analytics.logEvent("invoice", "transfer", "Transferred items between invoices");
                this.emitInvoiceChanged();
            }, (error: ThError) => {
                this.transferInProgress = false;
                this.context.toaster.error(error.message);
            });
    }
    private updateInvoiceOn(invoiceVm: InvoiceVM, newInvoice: InvoiceDO) {
        invoiceVm.invoice = new InvoiceDO();
        invoiceVm.invoice.buildFromObject(newInvoice);
        invoiceVm.recreateInvoiceItemVms();
        invoiceVm.invoiceMeta = this.invoiceMetaFactory.getInvoiceMeta(newInvoice.paymentStatus, newInvoice.accountingType);
    }

    public transferItemsToRight(item: InvoiceItemDO) {
        if (this.context.thUtils.isUndefinedOrNull(this.transferInvoice)) {
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
        if (this.context.thUtils.isUndefinedOrNull(this.transferInvoice)) {
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
        if (!this.context.thUtils.isUndefinedOrNull(existingTransfer)) {
            this.transfers = _.without(this.transfers, existingTransfer);
            return;
        }
        this.transfers.push({ sourceInvoiceId, destinationInvoiceId, transactionId });
    }

    public isTransferedItem(item: InvoiceItemDO): boolean {
        return !this.context.thUtils.isUndefinedOrNull(_.find(this.transfers, (transfer: Transfer) => {
            return (transfer.transactionId === item.transactionId) || (transfer.transactionId === item.parentTransactionId);
        }));
    }

    public getInvoiceItemDisplayName(itemVm: InvoiceItemVM): string {
        return itemVm.getDisplayName(this.context.thTranslation);
    }

    public hasAtLeastOneTransientTransfer(): boolean {
        return this.transfers.length > 0;
    }

    public get transferInvoiceTransientAmountToPay(): number {
        var amountToPay = _.reduce(this.transferInvoice.invoice.itemList, function (sum, item: InvoiceItemDO) {
            return sum + item.meta.getTotalPrice();
        }, 0);
        amountToPay = this.context.thUtils.roundNumberToTwoDecimals(amountToPay);
        return amountToPay;
    }

    public get currentInvoiceTransientAmountToPay(): number {
        var amountToPay = _.reduce(this.currentInvoice.invoice.itemList, function (sum, item: InvoiceItemDO) {
            return sum + item.meta.getTotalPrice();
        }, 0);
        amountToPay = this.context.thUtils.roundNumberToTwoDecimals(amountToPay);
        return amountToPay;
    }

    public goToCustomer(customerId: string) {
        this.operationsPageControllerService.goToCustomer(customerId);
    }

    public emitInvoiceChanged() {
        this.invoiceChanged.emit({
            reloadInvoiceGroup: false
        });
    }
}
