import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';
import {AllotmentMetaRepoDO, AllotmentSearchCriteriaRepoDO, AllotmentSearchResultRepoDO} from '../../IAllotmentRepository';
import {AllotmentDO, AllotmentStatus} from '../../../data-objects/AllotmentDO';
import {AllotmentRepositoryHelper} from './helpers/AllotmentRepositoryHelper';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';

export class MongoAllotmentReadOperationsRepository extends MongoRepository {
	private _helper: AllotmentRepositoryHelper;

	constructor(allotmentEntity: Sails.Model) {
        super(allotmentEntity);
		this._helper = new AllotmentRepositoryHelper();
    }

	public getAllotmentListCount(meta: AllotmentMetaRepoDO, searchCriteria: AllotmentSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
		return new Promise<LazyLoadMetaResponseRepoDO>((resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }) => {
			this.getAllotmentListCountCore(resolve, reject, meta, searchCriteria);
		});
	}
	private getAllotmentListCountCore(resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }, meta: AllotmentMetaRepoDO, searchCriteria: AllotmentSearchCriteriaRepoDO) {
		var query = this.buildSearchCriteria(meta, searchCriteria);
		return this.getDocumentCount(query,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.AllotmentRepositoryErrorReadingDocumentCount, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error reading document count", { meta: meta, searchCriteria: searchCriteria }, thError);
				reject(thError);
			},
			(meta: LazyLoadMetaResponseRepoDO) => {
				resolve(meta);
			});
	}

	public getAllotmentList(meta: AllotmentMetaRepoDO, searchCriteria: AllotmentSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<AllotmentSearchResultRepoDO> {
		return new Promise<AllotmentSearchResultRepoDO>((resolve: { (result: AllotmentSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
			this.getAllotmentListCore(resolve, reject, meta, searchCriteria, lazyLoad);
		});
	}
	private getAllotmentListCore(resolve: { (result: AllotmentSearchResultRepoDO): void }, reject: { (err: ThError): void }, meta: AllotmentMetaRepoDO, searchCriteria: AllotmentSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO) {
		var mongoSearchCriteria: MongoSearchCriteria = {
			criteria: this.buildSearchCriteria(meta, searchCriteria),
			lazyLoad: lazyLoad
		}
		this.findMultipleDocuments(mongoSearchCriteria,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.AllotmentRepositoryErrorGettingList, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting allotment list", { meta: meta, searchCriteria: searchCriteria }, thError);
				reject(thError);
			},
			(foundAllotmentList: Object[]) => {
				var allotmentList = this._helper.buildAllotmentListFrom(foundAllotmentList);
				resolve({
					allotmentList: allotmentList,
					lazyLoad: lazyLoad
				});
			}
		);
	}

	private buildSearchCriteria(meta: AllotmentMetaRepoDO, searchCriteria: AllotmentSearchCriteriaRepoDO): Object {
		var mongoQueryBuilder = new MongoQueryBuilder();
		mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
		if (!this._thUtils.isUndefinedOrNull(searchCriteria)) {
			mongoQueryBuilder.addExactMatch("status", searchCriteria.status);
			mongoQueryBuilder.addExactMatch("customerId", searchCriteria.customerId);
			if (!this._thUtils.isUndefinedOrNull(searchCriteria.priceProductIdList) && _.isArray(searchCriteria.priceProductIdList)) {
				mongoQueryBuilder.addMultipleSelectOptionList("priceProductId", searchCriteria.priceProductIdList);
			}
			else {
				mongoQueryBuilder.addExactMatch("priceProductId", searchCriteria.priceProductId);
			}
			mongoQueryBuilder.addExactMatch("roomCategoryId", searchCriteria.roomCategoryId);
			mongoQueryBuilder.addMultipleSelectOptionList("id", searchCriteria.allotmentIdList);
		}
		return mongoQueryBuilder.processedQuery;
	}
}