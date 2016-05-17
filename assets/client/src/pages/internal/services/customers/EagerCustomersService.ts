import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {CustomersDO} from './data-objects/CustomersDO';

@Injectable()
export class EagerCustomersService {
	constructor(private _appContext: AppContext) {
	}

	public getCustomersById(customerIdList: string[]): Observable<CustomersDO> {
		if (!customerIdList || customerIdList.length == 0) {
			return this.getEmptyResult();
		}
		return this._appContext.thHttp.post(ThServerApi.Customers, { searchCriteria: { customerIdList: customerIdList } }).map((resultObject: Object) => {
			var customers = new CustomersDO();
			customers.buildFromObject(resultObject);
			return customers;
		});
	}
	private getEmptyResult(): Observable<CustomersDO> {
		return new Observable<CustomersDO>((serviceObserver: Observer<CustomersDO>) => {
			var customers = new CustomersDO();
			customers.customerList = [];
			serviceObserver.next(customers);
			serviceObserver.complete();
		});
	}
}