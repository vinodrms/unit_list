import {PriceProductDO, PriceProductStatus, PriceProductAvailability} from '../data-objects/PriceProductDO';
import {PriceProductYieldFilterMetaDO} from '../data-objects/yield-filter/PriceProductYieldFilterDO';
import {ThDayInYearIntervalDO} from '../../../utils/th-dates/data-objects/ThDayInYearIntervalDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';

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
}
export interface PriceProductUpdateYMIntervalsParamsRepoDO {
	openIntervalList: ThDayInYearIntervalDO[];
	openForArrivalIntervalList: ThDayInYearIntervalDO[];
	openForDepartureIntervalList: ThDayInYearIntervalDO[];
}

export interface PriceProductSearchCriteriaRepoDO {
	name?: string;
	status?: PriceProductStatus;
	statusList?: PriceProductStatus[];
	priceProductIdList?: string[];
	addOnProductIdList?: string[];
	taxIdList?: string[];
	availability?: PriceProductAvailability;
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
	updatePriceProductYieldFilters(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, filterList: PriceProductYieldFilterMetaDO[]): Promise<PriceProductDO>;
	updatePriceProductYieldManagerIntervals(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, intervals: PriceProductUpdateYMIntervalsParamsRepoDO): Promise<PriceProductDO>;
}