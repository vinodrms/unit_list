import {MongoRepository} from '../../../common/base/MongoRepository';
import {PriceProductDO} from '../../data-objects/PriceProductDO';
import {PriceProductYieldFilterMetaDO} from '../../data-objects/yield-filter/PriceProductYieldFilterDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {IPriceProductRepository, PriceProductMetaRepoDO, PriceProductSearchCriteriaRepoDO,
	PriceProductItemMetaRepoDO, PriceProductSearchResultRepoDO, PriceProductUpdateStatusParamsRepoDO, PriceProductUpdateYMIntervalsParamsRepoDO} from '../IPriceProductRepository';
import {MongoPriceProductCrudOperationsRepository} from './operations/MongoPriceProductCrudOperationsRepository';
import {MongoPriceProductReadOperationsRepository} from './operations/MongoPriceProductReadOperationsRepository';

export class MongoPriceProductRepository extends MongoRepository implements IPriceProductRepository {
	private _crudRepository: MongoPriceProductCrudOperationsRepository;
	private _readRepository: MongoPriceProductReadOperationsRepository;

	constructor() {
        var priceProdEntity = sails.models.priceproductsentity;
        super(priceProdEntity);
		this._crudRepository = new MongoPriceProductCrudOperationsRepository(priceProdEntity);
		this._readRepository = new MongoPriceProductReadOperationsRepository(priceProdEntity);
    }

	public getPriceProductListCount(meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
		return this._readRepository.getPriceProductListCount(meta, searchCriteria);
	}
	public getPriceProductList(meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<PriceProductSearchResultRepoDO> {
		return this._readRepository.getPriceProductList(meta, searchCriteria, lazyLoad);
	}

	public getPriceProductById(meta: PriceProductMetaRepoDO, priceProductId: string): Promise<PriceProductDO> {
		return this._crudRepository.getPriceProductById(meta, priceProductId);
	}
	public addPriceProduct(meta: PriceProductMetaRepoDO, priceProduct: PriceProductDO): Promise<PriceProductDO> {
		return this._crudRepository.addPriceProduct(meta, priceProduct);
	}
	public updatePriceProduct(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, priceProduct: PriceProductDO): Promise<PriceProductDO> {
		return this._crudRepository.updatePriceProduct(meta, itemMeta, priceProduct);
	}
	public updatePriceProductStatus(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, params: PriceProductUpdateStatusParamsRepoDO): Promise<PriceProductDO> {
		return this._crudRepository.updatePriceProductStatus(meta, itemMeta, params);
	}
	public updatePriceProductYieldFiltersAndNotes(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, filterList: PriceProductYieldFilterMetaDO[], notes: string): Promise<PriceProductDO> {
		return this._crudRepository.updatePriceProductYieldFiltersAndNotes(meta, itemMeta, filterList, notes);
	}
	public updatePriceProductYieldManagerIntervals(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, intervals: PriceProductUpdateYMIntervalsParamsRepoDO): Promise<PriceProductDO> {
		return this._crudRepository.updatePriceProductYieldManagerIntervals(meta, itemMeta, intervals);
	}
}