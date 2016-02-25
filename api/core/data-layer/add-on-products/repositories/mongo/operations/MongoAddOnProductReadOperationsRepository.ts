import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository} from '../../../../common/base/MongoRepository';
import {AddOnProductMetaRepoDO, AddOnProductSearchCriteriaRepoDO} from '../../IAddOnProductRepository';
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
		var findQuery: Object[] = [
			{ "hotelId": meta.hotelId },
			{ "status": AddOnProductStatus.Active }
		];
		this.findDistinctDocumentFieldValues("categoryId", { $and: findQuery },
			(err: Error) => {
				var thError = new ThError(ThStatusCode.MongoAddOnProductRepositoryErrorReadingCategoryIdList, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error reading categori id list for add on products", { meta: meta }, thError);
				reject(thError);
			},
			(distinctCategoryIdList: string[]) => {
				resolve(distinctCategoryIdList);
			}
		);
	}

	public getAddOnProductListCount(meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
		// TODO
		return null;
	}
	public getAddOnProductList(meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<AddOnProductDO[]> {
		// TODO
		return null;
	}
}