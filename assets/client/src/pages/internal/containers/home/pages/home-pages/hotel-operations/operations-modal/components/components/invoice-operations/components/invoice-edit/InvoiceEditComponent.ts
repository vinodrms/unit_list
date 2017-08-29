import { Component, OnInit} from '@angular/core';
import { AppContext } from "../../../../../../../../../../../../../common/utils/AppContext";


@Component({
    selector: 'invoice-edit',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-edit/template/invoice-edit.html',
})
export class InvoiceEditComponent implements OnInit {

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
}