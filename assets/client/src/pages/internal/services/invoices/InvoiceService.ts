import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ALazyLoadRequestService } from '../common/ALazyLoadRequestService';
import { InvoiceDO } from "./data-objects/InvoiceDO";
import { InvoicesDO } from "./data-objects/InvoicesDO";

@Injectable()
export class InvoiceService extends ALazyLoadRequestService<InvoiceDO> {

    private customerIdListFilter: string[];
    private term: string;

    constructor(appContext: AppContext) {
        super(appContext, ThServerApi.InvoicesCount, ThServerApi.Invoices);
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<InvoiceDO[]> {
        return new Observable<InvoiceDO[]>((invoiceGroupObserver: Observer<InvoiceDO[]>) => {
            var invoices = new InvoicesDO();
            invoices.buildFromObject(pageDataObject);
            invoiceGroupObserver.next(invoices.invoiceList);
            invoiceGroupObserver.complete();
        });
    }

    public setCustomerIdFilter(customerId: string) {
        this.customerIdListFilter = [customerId];
        this.rebuildDefaultSearchCriteria();
    }
    public searchByText(text: string) {
        this.term = text;
        this.rebuildDefaultSearchCriteria();
    }
    private rebuildDefaultSearchCriteria() {
        this.defaultSearchCriteria = { customerIdList: this.customerIdListFilter, term: this.term };
    }
}
