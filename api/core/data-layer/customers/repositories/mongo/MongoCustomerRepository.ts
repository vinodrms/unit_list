import {CustomerDO} from '../../data-objects/CustomerDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {ICustomerRepository, CustomerItemMetaRepoDO, CustomerMetaRepoDO, CustomerSearchCriteriaRepoDO, CustomerSearchResultRepoDO} from '../ICustomerRepository';
import {MongoRepository} from '../../../common/base/MongoRepository';
import {MongoCustomerCrudOperationsRepository} from './operations/MongoCustomerCrudOperationsRepository';
import {MongoCustomerReadOperationsRepository} from './operations/MongoCustomerReadOperationsRepository';

declare var sails: any;

export class MongoCustomerRepository extends MongoRepository implements ICustomerRepository {
	private _crudRepository: MongoCustomerCrudOperationsRepository;
	private _readRepository: MongoCustomerReadOperationsRepository;

	constructor() {
        var customerEntity = sails.models.customersentity;
        super(customerEntity);
		this._crudRepository = new MongoCustomerCrudOperationsRepository(customerEntity);
		this._readRepository = new MongoCustomerReadOperationsRepository(customerEntity);
    }

	public getCustomerListCount(meta: CustomerMetaRepoDO, searchCriteria: CustomerSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
		return this._readRepository.getCustomerListCount(meta, searchCriteria);
	}
	public getCustomerList(meta: CustomerMetaRepoDO, searchCriteria: CustomerSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<CustomerSearchResultRepoDO> {
		return this._readRepository.getCustomerList(meta, searchCriteria, lazyLoad);
	}

	public getCustomerById(meta: CustomerMetaRepoDO, customerId: string): Promise<CustomerDO> {
		return this._crudRepository.getCustomerById(meta, customerId);
	}
	public addCustomer(meta: CustomerMetaRepoDO, customer: CustomerDO): Promise<CustomerDO> {
		return this._crudRepository.addCustomer(meta, customer);
	}
	public updateCustomer(meta: CustomerMetaRepoDO, itemMeta: CustomerItemMetaRepoDO, customer: CustomerDO): Promise<CustomerDO> {
		return this._crudRepository.updateCustomer(meta, itemMeta, customer);
	}
}