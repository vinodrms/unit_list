import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ALazyLoadRequestService } from '../common/ALazyLoadRequestService';

import { EagerCustomersService } from '../customers/EagerCustomersService';
import { CustomersDO } from '../customers/data-objects/CustomersDO';
import { InvoicePaymentStatus } from './data-objects/InvoiceDO';
import { InvoiceGroupPayerStatsDO } from './data-objects/stats/InvoiceGroupPayerStatsDO';
import { InvoiceGroupsDO } from './data-objects/InvoiceGroupsDO';
import { InvoiceGroupDO } from './data-objects/InvoiceGroupDO';

export interface InvoiceGroupsQuery {
    groupBookingId: string;
    bookingId: string;
}

export interface CreditedInvoiceMetaDO {
    invoiceGroupId: string;
    invoiceId: string;
}

export interface ReinstateInvoiceMetaDO {
    invoiceGroupId: string;
    invoiceId: string;
}

@Injectable()
export class InvoiceGroupsService extends ALazyLoadRequestService<InvoiceGroupDO> {

    private _customerIdListFilter: string[];

    constructor(appContext: AppContext) {
        super(appContext, ThServerApi.InvoiceGroupsCount, ThServerApi.InvoiceGroups);
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<InvoiceGroupDO[]> {
        return new Observable<InvoiceGroupDO[]>((invoiceGroupObserver: Observer<InvoiceGroupDO[]>) => {
            var invoiceGroupsDO = new InvoiceGroupsDO();
            invoiceGroupsDO.buildFromObject(pageDataObject);
            invoiceGroupObserver.next(invoiceGroupsDO.invoiceGroupList);
            invoiceGroupObserver.complete();
        });
    }

    public setCustomerIdFilter(customerId: string) {
        this._customerIdListFilter = [customerId];
        this.defaultSearchCriteria = { customerIdList: this._customerIdListFilter };
    }

    public saveInvoiceGroupDO(invoiceGroup: InvoiceGroupDO): Observable<InvoiceGroupDO> {
        return this.runServerPostActionOnInvoiceGroup(ThServerApi.InvoiceGroupsSaveItem, { invoiceGroup: invoiceGroup });
    }

    public reinstate(reinstatedInvoice: ReinstateInvoiceMetaDO): Observable<InvoiceGroupDO> {
        return this.runServerPostActionOnInvoiceGroup(ThServerApi.InvoiceGroupsReinstate, { reinstatedInvoiceMeta: reinstatedInvoice });
    }

    private runServerPostActionOnInvoiceGroup(apiAction: ThServerApi, postData: Object): Observable<InvoiceGroupDO> {
        return this._appContext.thHttp.post({
            serverApi: apiAction,
            parameters: postData
        }).map((invoiceGroupObject: Object) => {
            var updatedInvoiceGroupDO = new InvoiceGroupDO();
            updatedInvoiceGroupDO.buildFromObject(invoiceGroupObject["invoiceGroup"]);
            return updatedInvoiceGroupDO;
        });
    }

    public searchByText(text: string) {

    }
}