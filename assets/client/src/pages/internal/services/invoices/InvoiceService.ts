import * as _ from "underscore";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ALazyLoadRequestService } from '../common/ALazyLoadRequestService';
import { InvoiceDO } from "./data-objects/InvoiceDO";
import { InvoicesDO } from "./data-objects/InvoicesDO";
import { EagerCustomersService } from "../customers/EagerCustomersService";
import { CustomersDO } from "../customers/data-objects/CustomersDO";
import { InvoiceVM } from "./view-models/InvoiceVM";
import { InvoicePayerDO } from "./data-objects/payer/InvoicePayerDO";
import { InvoiceVMHelper } from "./view-models/utils/InvoiceVMHelper";

@Injectable()
export class InvoiceService extends ALazyLoadRequestService<InvoiceVM> {

    private customerIdListFilter: string[];
    private term: string;

    constructor(appContext: AppContext, private _invoiceVMHelper: InvoiceVMHelper) {
        super(appContext, ThServerApi.InvoicesCount, ThServerApi.Invoices);
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<InvoiceVM[]> {
        var invoices = new InvoicesDO();
        invoices.buildFromObject(pageDataObject);
        return this._invoiceVMHelper.convertToViewModels(invoices);
    }

    public setCustomerIdFilter(customerId: string) {
        this.customerIdListFilter = [customerId];
        this.rebuildDefaultSearchCriteria();
    }
    public searchByText(text: string) {
        this.term = text;
        this.rebuildDefaultSearchCriteria();
        this.refreshData();
    }
    private rebuildDefaultSearchCriteria() {
        this.defaultSearchCriteria = { customerIdList: this.customerIdListFilter, term: this.term };
    }
}
