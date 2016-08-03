import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ALazyLoadRequestService} from '../common/ALazyLoadRequestService';

import {EagerCustomersService} from '../customers/EagerCustomersService';
import {CustomersDO} from '../customers/data-objects/CustomersDO';
import {InvoicePaymentStatus} from './data-objects/InvoiceDO';
import {InvoiceGroupPayerStatsDO} from './data-objects/stats/InvoiceGroupPayerStatsDO';
import {InvoiceGroupsDO} from './data-objects/InvoiceGroupsDO';

export interface InvoiceGroupsQuery {
    groupBookingId: string;
    bookingId: string;
}

export interface InvoiceGroupPayerStatsQuery {
    invoiceGroupPaymentStatus: InvoicePaymentStatus;
    customerIdList: string[];
}

@Injectable()
export class InvoiceGroupsService extends ALazyLoadRequestService<InvoiceGroupPayerStatsDO> {
    
    private _customerIdListFilter: string[];

    constructor(appContext: AppContext) {
        super(appContext, ThServerApi.InvoiceGroupsCount, ThServerApi.InvoiceGroups);
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<InvoiceGroupPayerStatsDO[]> {
        var invoiceGroupsDO = new InvoiceGroupsDO();
        invoiceGroupsDO.buildFromObject(pageDataObject);

        var invoiceGroupPayerStatsList = [];
        _.forEach(this._customerIdListFilter, (customerId: string) => {
            invoiceGroupPayerStatsList =
                _.union(invoiceGroupPayerStatsList, InvoiceGroupPayerStatsDO.buildInvoiceGroupPayerStatsListFromInvoiceGroupList(invoiceGroupsDO.invoiceGroupList, customerId));
        })

        return Observable.from(invoiceGroupPayerStatsList);
    }

    public setCustomerIdFilter(customerId: string) {
        this._customerIdListFilter = [customerId];
        this.defaultSearchCriteria = { customerIdList: this._customerIdListFilter };
    }

    public searchByText(text: string) {

    }
}