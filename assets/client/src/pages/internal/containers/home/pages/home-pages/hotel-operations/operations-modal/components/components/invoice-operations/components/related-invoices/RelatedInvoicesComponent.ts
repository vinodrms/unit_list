import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppContext } from "../../../../../../../../../../../../../common/utils/AppContext";
import { InvoiceVMMockup } from "../../InvoiceOperationsPageComponent";
import { CustomerVM } from "../../../../../../../../../../../services/customers/view-models/CustomerVM";

import _ = require('underscore');

@Component({
    selector: 'related-invoices',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/related-invoices/template/related-invoices.html',
})
export class RelatedInvoicesComponent implements OnInit {

    @Input() relatedInvoices: InvoiceVMMockup[];
    @Output() backToInvoiceOverviewClicked = new EventEmitter();
    @Output() relatedInvoiceIndexSelected = new EventEmitter();

    constructor(private _appContext: AppContext) {
    }

    ngOnInit() {
    }

    public backToInvoiceOverview() {
        this.backToInvoiceOverviewClicked.emit();
    }

    public getPayerListString(invoice: InvoiceVMMockup): string {
        var payerListString: string = "";
        _.forEach(invoice.payerList, (customer: CustomerVM, index: number) => {
            payerListString += customer.customerNameString;
            if (index < invoice.payerList.length - 1) {
                payerListString += ", ";
            }
        });
        return payerListString;
    }

    public selectRelatedInvoiceIndex(index: number) {
        this.relatedInvoiceIndexSelected.emit(index);
    }
}