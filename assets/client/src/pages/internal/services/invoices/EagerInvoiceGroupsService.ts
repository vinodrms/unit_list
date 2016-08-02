import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {InvoiceGroupDO} from './data-objects/InvoiceGroupDO';
import {InvoiceDO} from './data-objects/InvoiceDO';
import {InvoiceGroupsQuery, InvoiceGroupPayerStatsQuery} from './InvoiceGroupsService';
import {InvoiceGroupPayerStatsDO} from './data-objects/stats/InvoiceGroupPayerStatsDO';
import {InvoiceGroupsDO} from './data-objects/InvoiceGroupsDO';

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

    public getInvoiceGroupList(searchCriteria: InvoiceGroupsQuery): Observable<InvoiceGroupDO[]> {
        return this._appContext.thHttp.post(ThServerApi.InvoiceGroups, {
            searchCriteria: searchCriteria
        }).map((invoiceGroupsObject: Object) => {
            var invoiceGroupsDO = new InvoiceGroupsDO();
            invoiceGroupsDO.buildFromObject(invoiceGroupsObject);
            return invoiceGroupsDO.invoiceGroupList;    
        });
    }

    public getInvoiceGroupPayerStatsList(searchCriteria: InvoiceGroupPayerStatsQuery): Observable<InvoiceGroupPayerStatsDO[]> {
        return this._appContext.thHttp.post(ThServerApi.InvoiceGroups, {
            searchCriteria: searchCriteria
        }).map((invoiceGroupsObject: Object) => {
            var invoiceGroupList = [];
            var invoiceGroupsDO = new InvoiceGroupsDO();
            invoiceGroupsDO.buildFromObject(invoiceGroupsObject);

            var invoiceGroupPayerStatsList = [];
            _.forEach(searchCriteria.customerIdList, (customerId: string) => {
                invoiceGroupPayerStatsList = 
                    _.union(invoiceGroupPayerStatsList, InvoiceGroupPayerStatsDO.buildInvoiceGroupPayerStatsListFromInvoiceGroupList(invoiceGroupsDO.invoiceGroupList, customerId));
            }) 
            return invoiceGroupPayerStatsList;    
        });
    } 
}