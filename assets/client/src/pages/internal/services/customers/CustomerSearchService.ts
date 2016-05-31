import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {LazyLoadData} from '../common/ILazyLoadRequestService';
import {ATextSearchRequestService} from '../common/ATextSearchRequestService';
import {CustomerDO} from './data-objects/CustomerDO';
import {CustomersDO} from './data-objects/CustomersDO';
import {CustomerVM} from './view-models/CustomerVM';

@Injectable()
export class CustomerSearchService extends ATextSearchRequestService<CustomerVM> {

	constructor(appContext: AppContext) {
		super(appContext, ThServerApi.Customers);
	}

	protected parsePageItemListData(pageItemListDataObject: Object): Observable<CustomerVM[]> {
		return new Observable<CustomerVM[]>((customerObserver: Observer<CustomerVM[]>) => {
			var customers = new CustomersDO();
			customers.buildFromObject(pageItemListDataObject);

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


	protected getTextSearchCriteria(text: string): Object {
		if (!text) { return {} };
		return {
			indexedName: text
		};
	}
}