import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {InvoiceGroupDO} from './data-objects/InvoiceGroupDO';
import {InvoiceDO} from './data-objects/InvoiceDO';

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

    public getInvoice(groupBookingId: string, bookingId: string): Observable<InvoiceDO> {
        return this._appContext.thHttp.post(ThServerApi.Invoice, {
            searchCriteria: {
                groupBookingId: groupBookingId,
                bookingId: bookingId
            }
        }).map((invoiceObject: Object) => {
            var invoiceDO = new InvoiceDO();
            invoiceDO.buildFromObject(invoiceObject);
            return invoiceDO;
        });
    }
}