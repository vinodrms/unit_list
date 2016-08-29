import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {CustomerDO} from './data-objects/CustomerDO';
import {CustomersDO} from './data-objects/CustomersDO';

@Injectable()
export class EagerCustomersService {
	constructor(private _appContext: AppContext) {
	}

	public getCustomersById(customerIdList: string[]): Observable<CustomersDO> {
		if (!customerIdList || customerIdList.length == 0) {
			return this.getEmptyResult();
		}
		return this.getCustomersBySearchCriteria({ customerIdList: customerIdList });
	}
	public getCustomerById(customerId: string): Observable<CustomerDO> {
		return this.getCustomersById([customerId]).map((customersContainer: CustomersDO) => {
			return customersContainer.customerList[0];
		});
	}

	public getCustomersByBookingCode(bookingCode: string): Observable<CustomersDO> {
		if (!bookingCode || !_.isString(bookingCode)) {
			return this.getEmptyResult();
		}
		return this.getCustomersBySearchCriteria({ bookingCode: bookingCode });
	}

	private getCustomersBySearchCriteria(searchCriteria: Object): Observable<CustomersDO> {
		return this._appContext.thHttp.post(ThServerApi.Customers, { searchCriteria: searchCriteria }).map((resultObject: Object) => {
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