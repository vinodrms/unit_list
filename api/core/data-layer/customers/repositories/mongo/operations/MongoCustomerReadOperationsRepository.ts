import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {CustomerRepositoryHelper} from './helpers/CustomerRepositoryHelper';
import {MongoRepository, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';
import {CustomerMetaRepoDO, CustomerSearchCriteriaRepoDO, CustomerSearchResultRepoDO} from '../../ICustomerRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import {CustomerStatus} from '../../../data-objects/CustomerDO';

export class MongoCustomerReadOperationsRepository extends MongoRepository {
	private _helper: CustomerRepositoryHelper;

    constructor(customerEntity: Sails.Model) {
        super(customerEntity);
		this._helper = new CustomerRepositoryHelper();
    }

	public getCustomerListCount(meta: CustomerMetaRepoDO, searchCriteria: CustomerSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
		return new Promise<LazyLoadMetaResponseRepoDO>((resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }) => {
			this.getCustomerListCountCore(meta, searchCriteria, resolve, reject);
		});
	}
	private getCustomerListCountCore(meta: CustomerMetaRepoDO, searchCriteria: CustomerSearchCriteriaRepoDO, resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }) {
		var query = this.buildSearchCriteria(meta, searchCriteria);
		return this.getDocumentCount(query,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.CustomerRepositoryErrorReadingCustomerCount, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error reading customer count", { meta: meta, searchCriteria: searchCriteria }, thError);
				reject(thError);
			},
			(meta: LazyLoadMetaResponseRepoDO) => {
				resolve(meta);
			});
	}

	public getCustomerList(meta: CustomerMetaRepoDO, searchCriteria: CustomerSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<CustomerSearchResultRepoDO> {
		return new Promise<CustomerSearchResultRepoDO>((resolve: { (result: CustomerSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
			this.getCustomerListCore(resolve, reject, meta, searchCriteria, lazyLoad);
		});
	}
	private getCustomerListCore(resolve: { (result: CustomerSearchResultRepoDO): void }, reject: { (err: ThError): void }, meta: CustomerMetaRepoDO, searchCriteria: CustomerSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO) {
		var mongoSearchCriteria: MongoSearchCriteria = {
			criteria: this.buildSearchCriteria(meta, searchCriteria),
			sortCriteria: { type: 1 },
			lazyLoad: lazyLoad
		}
		this.findMultipleDocuments(mongoSearchCriteria,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.CustomerRepositoryErrorGettingList, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting customer list", { meta: meta, searchCriteria: searchCriteria }, thError);
				reject(thError);
			},
			(foundCustomerList: Object[]) => {
				var customerList = this._helper.buildCustomerDOListFrom(foundCustomerList);
				resolve({
					customerList: customerList,
					lazyLoad: lazyLoad
				});
			}
		);
	}

	private buildSearchCriteria(meta: CustomerMetaRepoDO, searchCriteria: CustomerSearchCriteriaRepoDO): Object {
		var mongoQueryBuilder = new MongoQueryBuilder();
		mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
		mongoQueryBuilder.addExactMatch("status", CustomerStatus.Active);
		if (!this._thUtils.isUndefinedOrNull(searchCriteria)) {
			mongoQueryBuilder.addMultipleSelectOptionList("id", searchCriteria.customerIdList);
			mongoQueryBuilder.addTextIndexSearch(searchCriteria.searchText);
			mongoQueryBuilder.addExactMatch("type", searchCriteria.type);
			mongoQueryBuilder.addMultipleSelectOptionList("priceProductDetails.priceProductIdList", searchCriteria.priceProductIdList);
			mongoQueryBuilder.addRegex("indexedName", searchCriteria.indexedName);
		}
		return mongoQueryBuilder.processedQuery;
	}
}