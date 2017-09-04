import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppContext } from "../../../../../../../../../../../../../common/utils/AppContext";
import { InvoiceVMMockup } from "../../InvoiceOperationsPageComponent";
import { CustomerVM } from "../../../../../../../../../../../services/customers/view-models/CustomerVM";
import { ThUtils } from "../../../../../../../../../../../../../common/utils/ThUtils";


@Component({
    selector: 'invoice-transfer',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-transfer/template/invoice-transfer.html',
})
export class InvoiceTransferComponent implements OnInit {

    @Input() relatedInvoices: InvoiceVMMockup[];
    @Input() currentRelatedInvoiceIndex: number;
    @Output() backToInvoiceOverviewClicked = new EventEmitter();

    private _thUtils: ThUtils;
    
    transferInvoice: InvoiceVMMockup;

    constructor(private _appContext: AppContext) {
        this._thUtils = new ThUtils();
    }

    ngOnInit() {
    }

    public get currentInvoice(): InvoiceVMMockup {
        return this.relatedInvoices[this.currentRelatedInvoiceIndex];
    }

    public get payerList(): CustomerVM[] {
        return this.currentInvoice.payerList;
    }

    public backToInvoiceOverview() {
        this.backToInvoiceOverviewClicked.emit();
    }

    public isInvoiceSelectedForTransfer(): boolean {
        return !this._thUtils.isUndefinedOrNull(this.transferInvoice);
    }

    public selectInvoiceForTransfer() {
        this.transferInvoice = this.relatedInvoices[3];
    }

}