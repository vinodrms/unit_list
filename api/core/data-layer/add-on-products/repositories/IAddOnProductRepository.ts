import {AddOnProductDO} from '../data-objects/AddOnProductDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';

export interface AddOnProductMetaRepoDO {
	hotelId: string;
}
export interface AddOnProductItemMetaRepoDO {
	id: string;
	versionId: number;
}
export interface AddOnProductSearchCriteriaRepoDO {
	name?: string;
	categoryIdList?: string[];
	notEqualCategoryId?: string;
	addOnProductIdList?: string[];
	taxIdList?: string[];
}
export interface AddOnProductSearchResultRepoDO {
	lazyLoad?: LazyLoadRepoDO;
	addOnProductList: AddOnProductDO[];
}

export interface IAddOnProductRepository {
	getAddOnProductCategoryIdList(meta: AddOnProductMetaRepoDO): Promise<string[]>;
	getAddOnProductListCount(meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO>;
	getAddOnProductList(meta: AddOnProductMetaRepoDO, searchCriteria: AddOnProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<AddOnProductSearchResultRepoDO>;

	getAddOnProductById(meta: AddOnProductMetaRepoDO, addOnProductId: string): Promise<AddOnProductDO>;

	addAddOnProduct(meta: AddOnProductMetaRepoDO, addOnProduct: AddOnProductDO): Promise<AddOnProductDO>;
	updateAddOnProduct(meta: AddOnProductMetaRepoDO, itemMeta: AddOnProductItemMetaRepoDO, addOnProduct: AddOnProductDO): Promise<AddOnProductDO>;
	deleteAddOnProduct(meta: AddOnProductMetaRepoDO, itemMeta: AddOnProductItemMetaRepoDO, addOnProduct: AddOnProductDO): Promise<AddOnProductDO>;
}