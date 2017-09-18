import {Component, Input, Output, EventEmitter} from '@angular/core';
import { AppContext } from '../../../../../../../../../common/utils/AppContext';
import { InvoiceVM } from "../../../../../../../services/invoices/view-models/InvoiceVM";
import { InvoiceItemVM } from "../../../../../../../services/invoices/view-models/InvoiceItemVM";
import { CurrencyDO } from "../../../../../../../services/common/data-objects/currency/CurrencyDO";

@Component({
    selector: 'invoice-details',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/invoices-history/components/invoice-details/template/invoice-details.html'
})
export class InvoiceDetailsComponent {
    @Output() onEdit = new EventEmitter<InvoiceVM>();
    public editInvoice() {
        this.onEdit.next(this._invoiceVM);
    }

    private _invoiceVM: InvoiceVM;
    public get invoiceVM(): InvoiceVM {
        return this._invoiceVM;
    }
    @Input()
    public set invoiceVM(invoiceVM: InvoiceVM) {
        this._invoiceVM = invoiceVM;
    }

    private _ccy: CurrencyDO;
    @Input()
    public set ccy(ccy: CurrencyDO) {
        this._ccy = ccy;
    }

    constructor(private _appContext: AppContext) {
    }

    public getInvoiceItemDisplayName(itemVm: InvoiceItemVM): string {
        return itemVm.getDisplayName(this._appContext.thTranslation);
    }
    
    public get ccySymbol(): string {
        return this._ccy.symbol;
    }
}