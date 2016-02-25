import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';
import {AddOnProductDO} from '../../data-objects/AddOnProductDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {IAddOnProductRepository, AddOnProductMetaRepoDO, AddOnProductSearchCriteriaRepoDO, AddOnProductItemMetaRepoDO} from '../IAddOnProductRepository';
import {MongoAddOnProductCrudOperationsRepository} from './operations/MongoAddOnProductCrudOperationsRepository';

export class MongoAddOnProductRepository extends MongoRepository implements IAddOnProductRepository {
	private _crudRepository: MongoAddOnProductCrudOperationsRepository;
    
	constructor() {
        var addOnProdEntity = sails.models.addonproductentity;
        super(addOnProdEntity);
		this._crudRepository = new MongoAddOnProductCrudOperationsRepository(addOnProdEntity);
    }

	public getAddOnProductCategoryIdList(meta: AddOnProductMetaRepoDO): Promise<string[]> {
		// TODO
		return null;
	}

	public getAddOnProductListCount(meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
		// TODO
		return null;
	}
	public getAddOnProductList(meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<AddOnProductDO[]> {
		// TODO
		return null;
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
	public deleteAddOnProduct(meta: AddOnProductMetaRepoDO, itemMeta: AddOnProductItemMetaRepoDO): Promise<AddOnProductDO> {
		return this._crudRepository.deleteAddOnProduct(meta, itemMeta);
	}
}