import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { InvoiceGroupDO } from './data-objects/InvoiceGroupDO';
import { InvoiceDO, InvoicePaymentStatus } from './data-objects/InvoiceDO';
import { InvoiceGroupsQuery } from './InvoiceGroupsService';
import { InvoiceGroupsDO } from './data-objects/InvoiceGroupsDO';

@Injectable()
export class EagerInvoiceGroupsService {
    constructor(private _appContext: AppContext) {
    }

    public getInvoiceGroup(invoiceGroupId: string): Observable<InvoiceGroupDO> {
        return this._appContext.thHttp.get({
            serverApi: ThServerApi.InvoiceGroupItem,
            parameters: {
                id: invoiceGroupId
            }
        }).map((invoiceGroupObject: Object) => {
            var invoiceGroupDO = new InvoiceGroupDO();
            invoiceGroupDO.buildFromObject(invoiceGroupObject);
            return invoiceGroupDO;
        });
    }

    public getInvoiceGroupList(searchCriteria: InvoiceGroupsQuery): Observable<InvoiceGroupDO[]> {
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.InvoiceGroups,
            parameters: {
                searchCriteria: searchCriteria
            }
        }).map((invoiceGroupsObject: Object) => {
            var invoiceGroupsDO = new InvoiceGroupsDO();
            invoiceGroupsDO.buildFromObject(invoiceGroupsObject);
            return invoiceGroupsDO.invoiceGroupList;
        });
    }
}