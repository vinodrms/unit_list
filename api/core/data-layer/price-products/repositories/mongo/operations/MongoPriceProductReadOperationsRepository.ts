import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';
import {PriceProductMetaRepoDO, PriceProductSearchCriteriaRepoDO, PriceProductSearchResultRepoDO} from '../../IPriceProductRepository';
import {PriceProductDO, PriceProductStatus} from '../../../data-objects/PriceProductDO';
import {PriceProductRepositoryHelper} from './helpers/PriceProductRepositoryHelper';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';

export class MongoPriceProductReadOperationsRepository extends MongoRepository {
	private _helper: PriceProductRepositoryHelper;

    constructor(priceProdEntity: Sails.Model) {
        super(priceProdEntity);
		this._helper = new PriceProductRepositoryHelper();
    }

	public getPriceProductListCount(meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
		return new Promise<LazyLoadMetaResponseRepoDO>((resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }) => {
			this.getPriceProductListCountCore(resolve, reject, meta, searchCriteria);
		});
	}
	private getPriceProductListCountCore(resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }, meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO) {
		var query = this.buildSearchCriteria(meta, searchCriteria);
		return this.getDocumentCount(query,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.PriceProductRepositoryErrorReadingDocumentCount, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error reading document count", { meta: meta, searchCriteria: searchCriteria }, thError);
				reject(thError);
			},
			(meta: LazyLoadMetaResponseRepoDO) => {
				resolve(meta);
			});
	}

	public getPriceProductList(meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<PriceProductSearchResultRepoDO> {
		return new Promise<PriceProductSearchResultRepoDO>((resolve: { (result: PriceProductSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
			this.getPriceProductListCore(resolve, reject, meta, searchCriteria, lazyLoad);
		});
	}
	private getPriceProductListCore(resolve: { (result: PriceProductSearchResultRepoDO): void }, reject: { (err: ThError): void }, meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO) {
		var mongoSearchCriteria: MongoSearchCriteria = {
			criteria: this.buildSearchCriteria(meta, searchCriteria),
			sortCriteria: { name: 1 },
			lazyLoad: lazyLoad
		}
		this.findMultipleDocuments(mongoSearchCriteria,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.PriceProductRepositoryErrorGettingList, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting price product list", { meta: meta, searchCriteria: searchCriteria }, thError);
				reject(thError);
			},
			(foundPriceProductList: Object[]) => {
				var priceProductList = this._helper.buildPriceProductListFrom(foundPriceProductList);
				resolve({
					priceProductList: priceProductList,
					lazyLoad: lazyLoad
				});
			}
		);
	}

	private buildSearchCriteria(meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO): Object {
		var mongoQueryBuilder = new MongoQueryBuilder();
		mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
		if (!this._thUtils.isUndefinedOrNull(searchCriteria)) {
			mongoQueryBuilder.addRegex("name", searchCriteria.name);
			mongoQueryBuilder.addExactMatch("status", searchCriteria.status);
			mongoQueryBuilder.addMultipleSelectOptionList("id", searchCriteria.priceProductIdList);
			mongoQueryBuilder.addMultipleSelectOptionList("addOnProductIdList", searchCriteria.addOnProductIdList);
		}
		return mongoQueryBuilder.processedQuery;
	}
}