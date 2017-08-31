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

@Injectable()
export class InvoiceService extends ALazyLoadRequestService<InvoiceVM> {

    private customerIdListFilter: string[];
    private term: string;

    constructor(appContext: AppContext,
        private eagerCustomersService: EagerCustomersService) {
        super(appContext, ThServerApi.InvoicesCount, ThServerApi.Invoices);
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<InvoiceVM[]> {
        var invoices = new InvoicesDO();
        invoices.buildFromObject(pageDataObject);
        return this.convertToViewModels(invoices);
    }
    private convertToViewModels(invoices: InvoicesDO): Observable<InvoiceVM[]> {
        var customerIdList: string[] = invoices.getUniqueCustomerIdList();

        return Observable.combineLatest(
            this.eagerCustomersService.getCustomersById(customerIdList)
        ).map((result: [CustomersDO]) => {
            var customers: CustomersDO = result[0];

            var invoiceVMList: InvoiceVM[] = [];
            _.forEach(invoices.invoiceList, (invoice: InvoiceDO) => {
                var invoiceVM = new InvoiceVM();
                invoiceVM.invoice = invoice;
                invoiceVM.customerList = [];

                _.forEach(invoice.payerList, (payer: InvoicePayerDO) => {
                    invoiceVM.customerList.push(customers.getCustomerById(payer.customerId));
                });

                invoiceVMList.push(invoiceVM);
            });
            return invoiceVMList;
        });
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
