import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ALazyLoadRequestService} from '../common/ALazyLoadRequestService';
import {CustomerDO, CustomerType} from './data-objects/CustomerDO';
import {CustomersDO} from './data-objects/CustomersDO';
import {CustomerVM} from './view-models/CustomerVM';

@Injectable()
export class CustomersService extends ALazyLoadRequestService<CustomerVM> {
	constructor(appContext: AppContext) {
		super(appContext, ThServerApi.CustomersCount, ThServerApi.Customers);
	}

	protected parsePageDataCore(pageDataObject: Object): Observable<CustomerVM[]> {
		return new Observable<CustomerVM[]>((customerObserver: Observer<CustomerVM[]>) => {
			var customers = new CustomersDO();
			customers.buildFromObject(pageDataObject);

			var customerVMList: CustomerVM[] = [];
			_.forEach(customers.customerList, (customerDO: CustomerDO) => {
				var customerVM = new CustomerVM();
				customerVM.customer = customerDO;
				customerVMList.push(customerVM);
			});

			customerObserver.next(customerVMList);
			customerObserver.complete();
		});
	}
	public searchByText(text: string) {
		if(!text || text.length == 0) {
			this.updateSearchCriteria({});
			return;
		}
		this.updateSearchCriteria({
			searchText: text
		});
	}
	public setCustomerTypeFilter(customerType: CustomerType) {
		this.defaultSearchCriteria = {
			type: customerType
		}
	}
	public removeCustomerTypeFilter() {
		this.defaultSearchCriteria = {}
	}

	public saveCustomerDO(customer: CustomerDO): Observable<CustomerDO> {
		return this._appContext.thHttp.post(ThServerApi.CustomersSaveItem, { customer: customer }).map((customerObject: Object) => {
			this.refreshData();

			var updatedCustomerDO: CustomerDO = new CustomerDO();
			updatedCustomerDO.buildFromObject(customerObject["customer"]);
			return updatedCustomerDO;
		});
	}
}