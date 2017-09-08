import { InvoicesDO } from "../../data-objects/InvoicesDO";
import { Observable } from "rxjs/Observable";
import { InvoiceVM } from "../InvoiceVM";
import { CustomersDO } from "../../../customers/data-objects/CustomersDO";
import { InvoiceDO } from "../../data-objects/InvoiceDO";
import { InvoicePayerDO } from "../../data-objects/payer/InvoicePayerDO";
import { AppContext } from "../../../../../../common/utils/AppContext";
import { EagerCustomersService } from "../../../customers/EagerCustomersService";
import { Injectable } from "@angular/core";
import { InvoiceMetaFactory } from "../../data-objects/InvoiceMetaFactory";

import _ = require('underscore');

@Injectable()
export class InvoiceVMHelper {

    private _invoiceMetaFactory: InvoiceMetaFactory;

    constructor(appContext: AppContext,
        private eagerCustomersService: EagerCustomersService) {
            this._invoiceMetaFactory = new InvoiceMetaFactory();
    }

    public convertToViewModels(invoices: InvoicesDO): Observable<InvoiceVM[]> {
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
                invoiceVM.invoiceMeta = this._invoiceMetaFactory.getInvoiceMetaByPaymentStatus(invoice.paymentStatus);

                invoiceVMList.push(invoiceVM);
            });
            return invoiceVMList;
        });
    }
}