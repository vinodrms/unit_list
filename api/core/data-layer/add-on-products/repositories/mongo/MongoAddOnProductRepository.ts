import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';
import {AddOnProductDO} from '../../data-objects/AddOnProductDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {IAddOnProductRepository, AddOnProductMetaRepoDO, AddOnProductSearchCriteriaRepoDO, AddOnProductItemMetaRepoDO, AddOnProductSearchResultRepoDO} from '../IAddOnProductRepository';
import {MongoAddOnProductCrudOperationsRepository} from './operations/MongoAddOnProductCrudOperationsRepository';
import {MongoAddOnProductReadOperationsRepository} from './operations/MongoAddOnProductReadOperationsRepository';

export class MongoAddOnProductRepository extends MongoRepository implements IAddOnProductRepository {
	private _crudRepository: MongoAddOnProductCrudOperationsRepository;
	private _readRepository: MongoAddOnProductReadOperationsRepository;

	constructor() {
        var addOnProdEntity = sails.models.addonproductentity;
        super(addOnProdEntity);
		this._crudRepository = new MongoAddOnProductCrudOperationsRepository(addOnProdEntity);
		this._readRepository = new MongoAddOnProductReadOperationsRepository(addOnProdEntity);
    }

	public getAddOnProductCategoryIdList(meta: AddOnProductMetaRepoDO): Promise<string[]> {
		return this._readRepository.getAddOnProductCategoryIdList(meta);
	}
	public getAddOnProductListCount(meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
		return this._readRepository.getAddOnProductListCount(meta, searchCriteria);
	}
	public getAddOnProductList(meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<AddOnProductSearchResultRepoDO> {
		return this._readRepository.getAddOnProductList(meta, searchCriteria, lazyLoad);
	}

	public getAddOnProductById(meta: AddOnProductMetaRepoDO, addOnProductId: string): Promise<AddOnProductDO> {
		return this._crudRepository.getAddOnProductById(meta, addOnProductId);
	}
	public addAddOnProduct(meta: AddOnProductMetaRepoDO, addOnProduct: AddOnProductDO): Promise<AddOnProductDO> {
		return this._crudRepository.addAddOnProduct(meta, addOnProduct);
	}
	public updateAddOnProduct(meta: AddOnProductMetaRepoDO, itemMeta: AddOnProductItemMetaRepoDO, addOnProduct: AddOnProductDO): Promise<AddOnProductDO> {
		return this._crudRepository.updateAddOnProduct(meta, itemMeta, addOnProduct);
	}
	public deleteAddOnProduct(meta: AddOnProductMetaRepoDO, itemMeta: AddOnProductItemMetaRepoDO, addOnProduct: AddOnProductDO): Promise<AddOnProductDO> {
		return this._crudRepository.deleteAddOnProduct(meta, itemMeta, addOnProduct);
	}
}