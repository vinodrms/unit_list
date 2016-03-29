import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';
import {AddOnProductMetaRepoDO, AddOnProductSearchCriteriaRepoDO, AddOnProductSearchResultRepoDO} from '../../IAddOnProductRepository';
import {AddOnProductDO, AddOnProductStatus} from '../../../data-objects/AddOnProductDO';
import {AddOnProductRepositoryHelper} from './helpers/AddOnProductRepositoryHelper';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';

export class MongoAddOnProductReadOperationsRepository extends MongoRepository {
	private _helper: AddOnProductRepositoryHelper;

    constructor(addOnProdEntity: Sails.Model) {
        super(addOnProdEntity);
		this._helper = new AddOnProductRepositoryHelper();
    }

	public getAddOnProductCategoryIdList(meta: AddOnProductMetaRepoDO): Promise<string[]> {
		return new Promise<string[]>((resolve: { (result: string[]): void }, reject: { (err: ThError): void }) => {
			this.getAddOnProductCategoryIdListCore(resolve, reject, meta);
		});
	}
	private getAddOnProductCategoryIdListCore(resolve: { (result: string[]): void }, reject: { (err: ThError): void }, meta: AddOnProductMetaRepoDO) {
		var findQuery: Object = {
			"hotelId": meta.hotelId,
			"status": AddOnProductStatus.Active
		};
		this.findDistinctDocumentFieldValues("categoryId", findQuery,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.AddOnProductRepositoryErrorReadingCategoryIdList, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error reading categori id list for add on products", { meta: meta }, thError);
				reject(thError);
			},
			(distinctCategoryIdList: string[]) => {
				resolve(distinctCategoryIdList);
			}
		);
	}

	public getAddOnProductListCount(meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
		return new Promise<LazyLoadMetaResponseRepoDO>((resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }) => {
			this.getAddOnProductListCountCore(resolve, reject, meta, searchCriteria);
		});
	}
	private getAddOnProductListCountCore(resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }, meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO) {
		var query = this.buildSearchCriteria(meta, searchCriteria);
		return this.getDocumentCount(query,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.AddOnProductRepositoryErrorReadingDocumentCount, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error reading document count", { meta: meta, searchCriteria: searchCriteria }, thError);
				reject(thError);
			},
			(meta: LazyLoadMetaResponseRepoDO) => {
				resolve(meta);
			});
	}

	public getAddOnProductList(meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<AddOnProductSearchResultRepoDO> {
		return new Promise<AddOnProductSearchResultRepoDO>((resolve: { (result: AddOnProductSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
			this.getAddOnProductListCore(resolve, reject, meta, searchCriteria, lazyLoad);
		});
	}
	private getAddOnProductListCore(resolve: { (result: AddOnProductSearchResultRepoDO): void }, reject: { (err: ThError): void }, meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO) {
		var mongoSearchCriteria: MongoSearchCriteria = {
			criteria: this.buildSearchCriteria(meta, searchCriteria),
			sortCriteria: { categoryId: 1, name: 1 },
			lazyLoad: lazyLoad
		}
		this.findMultipleDocuments(mongoSearchCriteria,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.AddOnProductRepositoryErrorGettingList, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting add on product list", { meta: meta, searchCriteria: searchCriteria }, thError);
				reject(thError);
			},
			(foundAddOnProductList: Object[]) => {
				var addOnProductList = this._helper.buildAddOnProductListFrom(foundAddOnProductList);
				resolve({
					addOnProductList: addOnProductList,
					lazyLoad: lazyLoad
				});
			}
		);
	}

	private buildSearchCriteria(meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO): Object {
		var mongoQueryBuilder = new MongoQueryBuilder();
		mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
		mongoQueryBuilder.addExactMatch("status", AddOnProductStatus.Active);
		if (!this._thUtils.isUndefinedOrNull(searchCriteria)) {
			mongoQueryBuilder.addMultipleSelectOptionList("categoryId", searchCriteria.categoryIdList);
			mongoQueryBuilder.addMultipleSelectOptionList("id", searchCriteria.addOnProductIdList);
			mongoQueryBuilder.addRegex("name", searchCriteria.name);
			mongoQueryBuilder.addMultipleSelectOptionList("taxIdList", searchCriteria.taxIdList);
		}
		return mongoQueryBuilder.processedQuery;
	}
}