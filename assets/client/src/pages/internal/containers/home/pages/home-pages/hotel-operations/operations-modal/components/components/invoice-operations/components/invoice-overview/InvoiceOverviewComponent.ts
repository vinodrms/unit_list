import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppContext } from "../../../../../../../../../../../../../common/utils/AppContext";
import { InvoiceVMMockup } from "../../InvoiceOperationsPageComponent";
import { CustomerVM } from "../../../../../../../../../../../services/customers/view-models/CustomerVM";


@Component({
    selector: 'invoice-overview',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-overview/template/invoice-overview.html',
})
export class InvoiceOverviewComponent implements OnInit {

    @Input() relatedInvoices: InvoiceVMMockup[];
    @Input() currentRelatedInvoiceIndex: number;
    @Output() showRelatedInvoicesClicked = new EventEmitter();
    @Output() showInvoiceTransferClicked = new EventEmitter();
    @Output() currentInvoiceChanged = new EventEmitter();

    constructor(private _appContext: AppContext) {
    }

    ngOnInit() {
    }

    public onPayInvoice() {
    }

    public onLossByManagementInvoice() {
    }

    public onReinstateInvoice() {
    }


    public moveToNextRelatedInvoice() {
        if (this.currentRelatedInvoiceIndex < this.relatedInvoices.length - 1) {
            this.currentRelatedInvoiceIndex++;
        } else {
            this.currentRelatedInvoiceIndex = 0;
        }
        this.currentInvoiceChanged.emit(this.currentRelatedInvoiceIndex);
    }

    public moveToPreviousRelatedInvoice() {
        if (this.currentRelatedInvoiceIndex > 0) {
            this.currentRelatedInvoiceIndex--;
        } else {
            this.currentRelatedInvoiceIndex = this.relatedInvoices.length - 1;
        }
        this.currentInvoiceChanged.emit(this.currentRelatedInvoiceIndex);
    }

    public get currentInvoice(): InvoiceVMMockup {
        return this.relatedInvoices[this.currentRelatedInvoiceIndex];
    }

    public get payerList(): CustomerVM[] {
        return this.currentInvoice.payerList;
    }

    public showRelatedInvoices() {
        this.showRelatedInvoicesClicked.emit();
    }

    public showInvoiceTransfer() {
        this.showInvoiceTransferClicked.emit();
    }
}