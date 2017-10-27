import _ = require('underscore');
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppContext, ThError } from "../../../../../../../../../../../../../common/utils/AppContext";
import { InvoiceVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceVM";
import { InvoiceOperationsPageData } from "../../utils/InvoiceOperationsPageData";
import { ModalDialogRef } from "../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { InvoiceDO } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { InvoiceSelectionModalService } from "../../../../../../../../../../common/inventory/modals/invoices/services/InvoiceSelectionModalService";
import { InvoicesDO } from "../../../../../../../../../../../services/invoices/data-objects/InvoicesDO";
import { InvoiceVMHelper } from "../../../../../../../../../../../services/invoices/view-models/utils/InvoiceVMHelper";
import { HotelOperationsInvoiceService, Transfer } from "../../../../../../../../../../../services/hotel-operations/invoice/HotelOperationsInvoiceService";
import { HotelOperationsPageControllerService } from '../../../../services/HotelOperationsPageControllerService';
import { InvoiceMetaFactory } from '../../../../../../../../../../../services/invoices/data-objects/InvoiceMetaFactory';
import { InvoiceChangedOptions } from '../invoice-overview/InvoiceOverviewComponent';
import { EagerRoomsService } from '../../../../../../../../../../../services/rooms/EagerRoomsService';
import { Transaction } from '../invoice-edit/InvoiceEditComponent';
import { InvoiceRemoveRight } from '../../../../../../../../../../../services/invoices/data-objects/InvoiceEditRights';

@Component({
    selector: 'invoice-transfer',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-transfer/template/invoice-transfer.html',
    providers: [EagerRoomsService, InvoiceSelectionModalService, InvoiceVMHelper, HotelOperationsInvoiceService]
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
    private deletePending: boolean;

    transferInvoice: InvoiceVM;
    public get currentInvoice(): InvoiceVM {
        return this.relatedInvoices[this.currentRelatedInvoiceIndex];
    }
    public set currentInvoice(value: InvoiceVM) {
        this.relatedInvoices[this.currentRelatedInvoiceIndex] = value;
    }

    constructor(private context: AppContext,
        private invoiceVMHelper: InvoiceVMHelper,
        private invoiceSelectionModalService: InvoiceSelectionModalService,
        private invoiceOperations: HotelOperationsInvoiceService,
        private operationsPageControllerService: HotelOperationsPageControllerService, ) {
        this.transferInProgress = false;
        this.invoiceMetaFactory = new InvoiceMetaFactory();
    }

    ngOnInit() {
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

    public transfer(transaction: Transaction) {
        if (this.transferInProgress || this.context.thUtils.isUndefinedOrNull(this.transferInvoice)) { return; }
        this.transferInProgress = true;

        let currentInvoiceId = this.currentInvoice.invoice.id;
        let transferInvoiceId = this.transferInvoice.invoice.id;

        let transfer: Transfer = {
            sourceInvoiceId: transaction.invoiceId,
            transactionId: transaction.transactionId,
            destinationInvoiceId: (transaction.invoiceId === currentInvoiceId) ? transferInvoiceId : currentInvoiceId
        }
        this.invoiceOperations.transfer([transfer])
            .subscribe((invoices: InvoiceDO[]) => {
                this.currentInvoice.invoice = _.find(invoices, (invoice: InvoiceDO) => {
                    return invoice.id === currentInvoiceId;
                });
                this.currentInvoice.recreateInvoiceItemVms();
                this.currentInvoice.invoiceMeta = this.invoiceMetaFactory.getInvoiceMeta(this.currentInvoice.invoice.paymentStatus, this.currentInvoice.invoice.accountingType);

                this.transferInvoice.invoice = _.find(invoices, (invoice: InvoiceDO) => {
                    return invoice.id === transferInvoiceId;
                });
                this.transferInProgress = false;
                let message = this.context.thTranslation.translate("Item moved succesfully");
                this.context.toaster.success(message);
                this.context.analytics.logEvent("invoice", "transfer", "Transferred items between invoices");
                this.emitInvoiceChanged();
            }, (error: ThError) => {
                this.transferInProgress = false;
                this.context.toaster.error(error.message);
            });
    }

    public backToInvoiceOverview() {
        this.backToInvoiceOverviewClicked.emit();
    }

    public isInvoiceSelectedForTransfer(): boolean {
        return !this.context.thUtils.isUndefinedOrNull(this.transferInvoice);
    }

    public openInvoiceSelectionModal() {
        this.invoiceSelectionModalService.openInvoiceSelectionModal(false, true, this.currentInvoice.invoice.id).then((modalDialogInstance: ModalDialogRef<InvoiceDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedInvoiceList: InvoiceDO[]) => {
                var invoicesDO: InvoicesDO = new InvoicesDO();
                invoicesDO.invoiceList = [this.currentInvoice.invoice, selectedInvoiceList[0]];

                let currentInvoiceId = this.currentInvoice.invoice.id;
                let transferInvoiceId = selectedInvoiceList[0].id;

                this.invoiceVMHelper.convertToViewModels(invoicesDO).subscribe((invoiceVMList: InvoiceVM[]) => {
                    let currentInvoice: InvoiceVM = _.find(invoiceVMList, (invoiceVM: InvoiceVM) => {
                        return invoiceVM.invoice.id === currentInvoiceId;
                    });
                    let transferInvoice: InvoiceVM = _.find(invoiceVMList, (invoiceVM: InvoiceVM) => {
                        return invoiceVM.invoice.id === transferInvoiceId;
                    });

                    // make sure the 2 invoices contain the same booking items
                    currentInvoice.bookingCustomerList = currentInvoice.bookingCustomerList.concat(transferInvoice.bookingCustomerList);
                    currentInvoice.bookingRoomList = currentInvoice.bookingRoomList.concat(transferInvoice.bookingRoomList);
                    transferInvoice.bookingCustomerList = currentInvoice.bookingCustomerList;
                    transferInvoice.bookingRoomList = currentInvoice.bookingRoomList;

                    this.transferInvoice = transferInvoice;
                    this.currentInvoice = currentInvoice;
                });
            });
        }).catch((e: any) => { });
    }

    public emitInvoiceChanged() {
        this.invoiceChanged.emit({
            reloadInvoiceGroup: false
        });
    }

    public hasInvoiceRemoveRight(invoiceVM: InvoiceVM): boolean {
        return !this.context.thUtils.isUndefinedOrNull(invoiceVM) && this.transferInvoice.invoiceMeta.invoiceRemoveRight === InvoiceRemoveRight.Edit;
    }
    public deleteTransferInvoice() {
        if (this.deletePending || !this.hasInvoiceRemoveRight(this.transferInvoice)) { return; }
        let title = this.context.thTranslation.translate("Info");
        let content = this.context.thTranslation.translate("Are you sure you want to delete this invoice?");
        this.context.modalService.confirm(title, content, {
            positive: this.context.thTranslation.translate("Yes"),
            negative: this.context.thTranslation.translate("No")
        }, () => {
            this.deletePending = true;
            this.invoiceOperations.delete(this.transferInvoice.invoice)
                .subscribe((invoice: InvoiceDO) => {
                    this.deletePending = false;
                    this.transferInvoice = null;
                    this.context.analytics.logEvent("invoice", "delete-from-transfer", "Deleted an invoice from the transfer screen");
                    this.context.toaster.success("The invoice was deleted.");
                }, (err: ThError) => {
                    this.deletePending = false;
                    this.context.toaster.error(err.message);
                });
        });
    }
}
