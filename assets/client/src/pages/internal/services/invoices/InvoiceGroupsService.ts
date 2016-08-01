import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ALazyLoadRequestService} from '../common/ALazyLoadRequestService';

import {EagerCustomersService} from '../customers/EagerCustomersService';
import {CustomersDO} from '../customers/data-objects/CustomersDO';
import {InvoiceGroupVM} from './view-models/InvoiceGroupVM';

@Injectable()
export class InvoiceGroupsService extends ALazyLoadRequestService<InvoiceGroupVM> {

    constructor(appContext: AppContext,
        private _eagerCustomersService: EagerCustomersService) {
        super(appContext, ThServerApi.InvoiceGroupsCount, ThServerApi.InvoiceGroups);
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<InvoiceGroupVM[]> {
        var customerIdList = [];
        
        return Observable.combineLatest(
            this._eagerCustomersService.getCustomersById(customerIdList)
        ).map((result: [CustomersDO]) => {

            var invoiceGroupVMList: InvoiceGroupVM[] = [];

            return invoiceGroupVMList;
        });
    }

    public searchByText(text: string) {
        this.updateSearchCriteria({
            searchTerm: text
        });
    }
}