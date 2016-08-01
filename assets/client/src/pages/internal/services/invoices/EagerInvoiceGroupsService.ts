import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {InvoiceGroupDO} from './data-objects/InvoiceGroupDO';

@Injectable()
export class EagerInvoiceGroupsService {
    constructor(private _appContext: AppContext) {
    }

    public getInvoiceGroup(invoiceGroupId: string): Observable<InvoiceGroupDO> {
        return this._appContext.thHttp.get(ThServerApi.InvoiceGroupItem, {
            id: invoiceGroupId
        }).map((invoiceGroup: Object) => {
            var invoiceGroupDO = new InvoiceGroupDO();
            
            return invoiceGroupDO;
        });
    }
}