import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppContext } from "../../../../../../../../../../../../../common/utils/AppContext";
import { InvoiceVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceVM";
import { CustomerDO } from "../../../../../../../../../../../services/customers/data-objects/CustomerDO";
import { InvoiceOperationsPageData } from "../../utils/InvoiceOperationsPageData";

import _ = require('underscore');

@Component({
    selector: 'related-invoices',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/related-invoices/template/related-invoices.html',
})
export class RelatedInvoicesComponent implements OnInit {

    @Input() relatedInvoices: InvoiceVM[];
    @Input() invoiceOperationsPageData: InvoiceOperationsPageData;
    @Output() backToInvoiceOverviewClicked = new EventEmitter();
    @Output() relatedInvoiceIndexSelected = new EventEmitter();

    constructor(private _appContext: AppContext) {
    }

    ngOnInit() {
    }

    public backToInvoiceOverview() {
        this.backToInvoiceOverviewClicked.emit();
    }

    public getPayerListString(invoice: InvoiceVM): string {
        var payerListString: string = "";
        _.forEach(invoice.customerList, (customer: CustomerDO, index: number) => {
            payerListString += customer.customerName;
            if (index < invoice.customerList.length - 1) {
                payerListString += ", ";
            }
        });
        return payerListString;
    }

    public selectRelatedInvoiceIndex(index: number) {
        this.relatedInvoiceIndexSelected.emit(index);
    }

    public get ccySymbol(): string {
        return this.invoiceOperationsPageData.ccy.symbol;
    }
}