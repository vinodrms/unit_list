import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';
import {CustomerDO, CustomerType} from '../data-objects/CustomerDO';

export interface CustomerMetaRepoDO {
	hotelId: string;
}
export interface CustomerItemMetaRepoDO {
	id: string;
	versionId: number;
}

export interface CustomerSearchCriteriaRepoDO {
	type?: CustomerType;
	customerIdList?: string[];
	searchText?: string;
	priceProductIdList?: string[];
}
export interface CustomerSearchResultRepoDO {
	lazyLoad?: LazyLoadRepoDO;
	customerList: CustomerDO[];
}

export interface ICustomerRepository {
	getCustomerListCount(meta: CustomerMetaRepoDO, searchCriteria: CustomerSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO>;
	getCustomerList(meta: CustomerMetaRepoDO, searchCriteria: CustomerSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<CustomerSearchResultRepoDO>;

	getCustomerById(meta: CustomerMetaRepoDO, customerId: string): Promise<CustomerDO>;
	addCustomer(meta: CustomerMetaRepoDO, customer: CustomerDO): Promise<CustomerDO>;
	updateCustomer(meta: CustomerMetaRepoDO, itemMeta: CustomerItemMetaRepoDO, customer: CustomerDO): Promise<CustomerDO>;
}