import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppContext } from "../../../../../../../../../../../../../common/utils/AppContext";
import { ThUtils } from "../../../../../../../../../../../../../common/utils/ThUtils";
import { InvoiceVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceVM";
import { CustomerDO } from "../../../../../../../../../../../services/customers/data-objects/CustomerDO";
import { InvoiceOperationsPageData } from "../../utils/InvoiceOperationsPageData";


@Component({
    selector: 'invoice-transfer',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-transfer/template/invoice-transfer.html',
})
export class InvoiceTransferComponent implements OnInit {

    @Input() relatedInvoices: InvoiceVM[];
    @Input() invoiceOperationsPageData: InvoiceOperationsPageData;
    @Input() currentRelatedInvoiceIndex: number;
    @Output() backToInvoiceOverviewClicked = new EventEmitter();

    private _thUtils: ThUtils;
    
    transferInvoice: InvoiceVM;

    constructor(private _appContext: AppContext) {
        this._thUtils = new ThUtils();
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

    public selectInvoiceForTransfer() {
        this.transferInvoice = this.relatedInvoices[3];
    }

    public get ccySymbol(): string {
        return this.invoiceOperationsPageData.ccy.symbol;
    }
}