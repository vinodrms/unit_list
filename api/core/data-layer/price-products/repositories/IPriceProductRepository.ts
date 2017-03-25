import { PriceProductDO, PriceProductStatus, PriceProductAvailability } from '../data-objects/PriceProductDO';
import { PriceProductYieldFilterMetaDO } from '../data-objects/yield-filter/PriceProductYieldFilterDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from '../../common/repo-data-objects/LazyLoadRepoDO';
import { CustomerPriceProductDetailsDO } from '../../customers/data-objects/price-product-details/CustomerPriceProductDetailsDO';
import { PriceProductPriceDO } from "../data-objects/price/PriceProductPriceDO";

export interface PriceProductMetaRepoDO {
	hotelId: string;
}
export interface PriceProductItemMetaRepoDO {
	id: string;
	versionId: number;
}
export interface PriceProductUpdateStatusParamsRepoDO {
	oldStatus: PriceProductStatus;
	newStatus: PriceProductStatus;
	priceProduct: PriceProductDO;
}
export interface PriceProductUpdateYMIntervalsParamsRepoDO {
	openIntervalList: ThDateIntervalDO[];
	openForArrivalIntervalList: ThDateIntervalDO[];
	openForDepartureIntervalList: ThDateIntervalDO[];
}

export interface PriceProductSearchCriteriaRepoDO {
	name?: string;
	status?: PriceProductStatus;
	statusList?: PriceProductStatus[];
	priceProductIdList?: string[];
	addOnProductIdList?: string[];
	taxIdList?: string[];
	availability?: PriceProductAvailability;
	customerPriceProductDetails?: CustomerPriceProductDetailsDO;
}
export interface PriceProductSearchResultRepoDO {
	lazyLoad?: LazyLoadRepoDO;
	priceProductList: PriceProductDO[];
}

export interface IPriceProductRepository {
	getPriceProductListCount(meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO>;
	getPriceProductList(meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<PriceProductSearchResultRepoDO>;

	getPriceProductById(meta: PriceProductMetaRepoDO, priceProductId: string): Promise<PriceProductDO>;

	addPriceProduct(meta: PriceProductMetaRepoDO, priceProduct: PriceProductDO): Promise<PriceProductDO>;

	updatePriceProduct(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, priceProduct: PriceProductDO): Promise<PriceProductDO>;
	updatePriceProductStatus(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, params: PriceProductUpdateStatusParamsRepoDO): Promise<PriceProductDO>;
	updatePriceProductYieldManagerIntervals(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, intervals: PriceProductUpdateYMIntervalsParamsRepoDO): Promise<PriceProductDO>;
}