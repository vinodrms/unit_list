import { MongoRepository } from "../../../../common/base/MongoRepository";
import { IPriceProductRepository, PriceProductMetaRepoDO, PriceProductSearchCriteriaRepoDO, PriceProductSearchResultRepoDO, PriceProductItemMetaRepoDO, PriceProductUpdateStatusParamsRepoDO, PriceProductUpdateYMIntervalsParamsRepoDO } from "../../IPriceProductRepository";
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from "../../../../common/repo-data-objects/LazyLoadRepoDO";
import { PriceProductDO } from "../../../data-objects/PriceProductDO";

export class MongoPriceProductRepositoryDecorator extends MongoRepository implements IPriceProductRepository {
    private _basePPRepo: IPriceProductRepository;

    constructor(basePPRepo: IPriceProductRepository) {
        super(sails.models.priceproductsentity);
        this._basePPRepo = basePPRepo;
    }

    public getPriceProductListCount(meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return this._basePPRepo.getPriceProductListCount(meta, searchCriteria);
    }
    public getPriceProductList(meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<PriceProductSearchResultRepoDO> {
        return this._basePPRepo.getPriceProductList(meta, searchCriteria, lazyLoad);
    }
    public getPriceProductById(meta: PriceProductMetaRepoDO, priceProductId: string): Promise<PriceProductDO> {
        return this._basePPRepo.getPriceProductById(meta, priceProductId);
    }
    public addPriceProduct(meta: PriceProductMetaRepoDO, priceProduct: PriceProductDO): Promise<PriceProductDO> {
        return this._basePPRepo.addPriceProduct(meta, priceProduct);
    }
    public updatePriceProduct(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, priceProduct: PriceProductDO): Promise<PriceProductDO> {
        return this._basePPRepo.updatePriceProduct(meta, itemMeta, priceProduct);
    }
    public updatePriceProductStatus(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, params: PriceProductUpdateStatusParamsRepoDO): Promise<PriceProductDO> {
        return this._basePPRepo.updatePriceProductStatus(meta, itemMeta, params);
    }
    public updatePriceProductYieldManagerIntervals(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, intervals: PriceProductUpdateYMIntervalsParamsRepoDO): Promise<PriceProductDO> {
        return this._basePPRepo.updatePriceProductYieldManagerIntervals(meta, itemMeta, intervals);
    }
}