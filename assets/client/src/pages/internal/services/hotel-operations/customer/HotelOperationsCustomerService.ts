import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../../common/utils/AppContext';
import {CustomerDO} from '../../customers/data-objects/CustomerDO';

@Injectable()
export class HotelOperationsCustomerService {

    constructor(private _appContext: AppContext) {
    }

    public changeDetails(customer: CustomerDO): Observable<CustomerDO> {
        return this._appContext.thHttp.post(ThServerApi.CustomersSaveItem, { customer: customer }).map((customerObject: Object) => {
            var updatedCustomerDO: CustomerDO = new CustomerDO();
            updatedCustomerDO.buildFromObject(customerObject["customer"]);
            return updatedCustomerDO;
        });
    }
}