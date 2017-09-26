import _ = require('underscore');
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppContext } from "../../../../../../../../../../../../../common/utils/AppContext";
import { InvoiceVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceVM";
import { CustomerDO } from "../../../../../../../../../../../services/customers/data-objects/CustomerDO";
import { InvoiceOperationsPageData } from "../../utils/InvoiceOperationsPageData";
import { PaginationOptions } from "../../utils/PaginationOptions";
import { InvoiceDO } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { InvoiceRemoveRight } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceEditRights";

@Component({
    selector: 'related-invoices',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/related-invoices/template/related-invoices.html',
})
export class RelatedInvoicesComponent implements OnInit {

    @Input() relatedInvoices: InvoiceVM[];
    @Input() invoiceOperationsPageData: InvoiceOperationsPageData;
    @Input() paginationOptions: PaginationOptions;
    @Output() backToInvoiceOverviewClicked = new EventEmitter();
    @Output() relatedInvoiceIndexSelected = new EventEmitter();

    constructor(private _appContext: AppContext) {
    }

    ngOnInit() {
    }

    public backToInvoiceOverview() {
        this.backToInvoiceOverviewClicked.emit();
    }

    public selectRelatedInvoiceIndex(index: number) {
        this.relatedInvoiceIndexSelected.emit(index);
    }

    public get ccySymbol(): string {
        return this.invoiceOperationsPageData.ccy.symbol;
    }

    public canDownloadInvoice(invoiceVM: InvoiceVM): boolean {
        return invoiceVM.invoice.payerList.length > 0;
    }

    public downloadInvoice(invoiceVM: InvoiceVM) {
        if (invoiceVM.invoice.payerList.length == 0) {
            return;
        }
        var payerId = invoiceVM.invoice.payerList[0].customerId;
        window.open(this.getInvoicePdfUrl(invoiceVM.invoice, payerId), '_blank');
        this._appContext.analytics.logEvent("invoice", "download", "Downloaded an invoice");
    }

    private getInvoicePdfUrl(invoice: InvoiceDO, customerId: string): string {
        let accessToken = this._appContext.tokenService.accessToken;
        return 'api/invoices/download?invoiceId='
            + invoice.id
            + '&customerId=' + customerId
            + '&token=' + accessToken;
    }

    public canDeleteInvoice(invoiceVM: InvoiceVM) {
        return invoiceVM.invoiceMeta.invoiceRemoveRight === InvoiceRemoveRight.Edit;
    }

    public deleteInvoice(invoiceVM: InvoiceVM) {
    }
}
