import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {LazyLoadData} from '../common/ILazyLoadRequestService';
import {ATextSearchRequestService} from '../common/ATextSearchRequestService';
import {CustomerDO} from './data-objects/CustomerDO';
import {CustomersDO} from './data-objects/CustomersDO';

@Injectable()
export class CustomerSearchService extends ATextSearchRequestService<CustomerDO> {
	constructor(appContext: AppContext) {
		super(appContext, ThServerApi.Customers);
	}
	protected parsePageItemListData(pageItemListDataObject: Object): Observable<CustomerDO[]> {
		return new Observable<CustomerDO[]>((customerObserver: Observer<CustomerDO[]>) => {
			var customers = new CustomersDO();
			customers.buildFromObject(pageItemListDataObject);
			customerObserver.next(customers.customerList);
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