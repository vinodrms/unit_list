import _ = require('underscore');
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AppContext, ThError } from "../../../../../../../../../../../../../common/utils/AppContext";
import { InvoiceVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceVM";
import { HotelOperationsInvoiceService } from "../../../../../../../../../../../services/hotel-operations/invoice/HotelOperationsInvoiceService";
import { InvoiceDO } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { InvoiceOperationsPageData } from "../../utils/InvoiceOperationsPageData";
import { InvoiceRemoveRight, InvoiceTransferRight } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceEditRights";
import { PaginationOptions } from "../../utils/PaginationOptions";
import { ViewInvoiceHistoryModalService } from "./modal/services/ViewInvoiceHistoryModalService";

export interface InvoiceChangedOptions {
    reloadInvoiceGroup: boolean;
    selectedInvoiceId?: string;
}

@Component({
    selector: 'invoice-overview',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-overview/template/invoice-overview.html',
    providers: [ViewInvoiceHistoryModalService]
})
export class InvoiceOverviewComponent {
    @Input() relatedInvoices: InvoiceVM[];
    @Input() currentRelatedInvoiceIndex: number;
    @Input() paginationOptions: PaginationOptions;
    @Input() invoiceOperationsPageData: InvoiceOperationsPageData;

    @Output() invoiceChanged = new EventEmitter<InvoiceChangedOptions>();
    public emitInvoiceChanged(options: InvoiceChangedOptions = { reloadInvoiceGroup: false }) {
        this.invoiceChanged.emit(options);
    }

    @Output() invoiceDeleted = new EventEmitter();
    public emitInvoiceDeleted() {
        this.invoiceDeleted.emit();
    }

    @Output() showInvoiceTransferRequested = new EventEmitter<string>();
    public showInvoiceTransfer(customerId?: string) {
        this.showInvoiceTransferRequested.emit(customerId);
    }

    @Output() showRelatedInvoicesClicked = new EventEmitter();
    public showRelatedInvoices() {
        this.showRelatedInvoicesClicked.emit();
    }

    private deletePending: boolean;

    constructor(private context: AppContext,
        private invoiceOperations: HotelOperationsInvoiceService,
        private viewInvoiceHistoryModalService: ViewInvoiceHistoryModalService
    ) {
        this.deletePending = false;
    }

    @Output() currentInvoiceChanged = new EventEmitter();
    public moveToNextRelatedInvoice() {
        this.currentRelatedInvoiceIndex++;
        if (this.currentRelatedInvoiceIndex >= this.relatedInvoices.length) {
            this.currentRelatedInvoiceIndex = 0;
        }
        this.currentInvoiceChanged.emit(this.currentRelatedInvoiceIndex);
    }
    public moveToPreviousRelatedInvoice() {
        this.currentRelatedInvoiceIndex--;
        if (this.currentRelatedInvoiceIndex < 0) {
            this.currentRelatedInvoiceIndex = this.relatedInvoices.length - 1;
        }
        this.currentInvoiceChanged.emit(this.currentRelatedInvoiceIndex);
    }

    public hasInvoiceRemoveRight(): boolean {
        return this.currentInvoice.invoiceMeta.invoiceRemoveRight === InvoiceRemoveRight.Edit;
    }
    public onDeleteInvoice() {
        if (this.deletePending) { return; }
        let content = this.context.thTranslation.translate("Are you sure you want to delete this invoice?");
        this.confirm("Delete Invoice", () => {
            this.deletePending = true;
            this.invoiceOperations.delete(this.currentInvoice.invoice)
                .subscribe((invoice: InvoiceDO) => {
                    this.emitInvoiceChanged({
                        reloadInvoiceGroup: true,
                        selectedInvoiceId: this.currentInvoice.invoice.id
                    });
                    this.deletePending = false;
                    this.context.analytics.logEvent("invoice", "delete", "Deleted an invoice");
                    this.context.toaster.success("The invoice was deleted.");
                    this.emitInvoiceDeleted();

                }, (err: ThError) => {
                    this.deletePending = false;
                    this.context.toaster.error(err.message);
                });
        }, content);
    }

    private confirm(status: string, onConfirm: (() => void), content: string = null) {
        var title = this.context.thTranslation.translate("Info");
        let translatedStatus = this.context.thTranslation.translate(status);
        if (!content) {
            content = this.context.thTranslation.translate("Are you sure you want to mark this invoice as %status%?", { status: translatedStatus });
        }
        var positiveLabel = this.context.thTranslation.translate("Yes");
        var negativeLabel = this.context.thTranslation.translate("No");
        this.context.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
            onConfirm();
        });
    }

    public hasInvoiceTransferRight(): boolean {
        return this.currentInvoice.invoiceMeta.invoiceTransferRight === InvoiceTransferRight.Edit;
    }
    public hasInvoiceHistory(): boolean {
        return this.currentInvoice.invoice.history && this.currentInvoice.invoice.history.hasActionHistory();
    }
    public onViewInvoiceHistory() {
        this.viewInvoiceHistoryModalService.openViewInvoiceHistoryModal(this.currentInvoice.invoice);
    }

    public get currentInvoice(): InvoiceVM {
        return this.relatedInvoices[this.currentRelatedInvoiceIndex];
    }
}
