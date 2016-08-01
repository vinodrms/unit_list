import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {InvoiceGroupDO} from './data-objects/InvoiceGroupDO';
import {InvoiceDO} from './data-objects/InvoiceDO';
import {InvoiceGroupSearchCriteriaRepoDO} from './InvoiceGroupsService';

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

    public getInvoiceGroupList(searchCriteria: InvoiceGroupSearchCriteriaRepoDO): Observable<InvoiceGroupDO[]> {
        return this._appContext.thHttp.post(ThServerApi.InvoiceGroups, {
            searchCriteria: searchCriteria
        }).map((invoiceObject: Object) => {
            var invoiceGroupList = [];
            var invoiceGroupObjectArray: Object[] = invoiceObject["invoiceGroupList"];
            _.forEach(invoiceGroupObjectArray, (invoiceGroupObject: Object) => {
                var invoiceGroupDO = new InvoiceGroupDO();
                invoiceGroupDO.buildFromObject(invoiceGroupObject);
                invoiceGroupList.push(invoiceGroupDO);
            });
            return invoiceGroupList;    
        });
    }
}