import {AllotmentDO, AllotmentStatus} from '../data-objects/AllotmentDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';

export interface AllotmentMetaRepoDO {
	hotelId: string;
}
export interface AllotmentItemMetaRepoDO {
	id: string;
	versionId: number;
}
export interface AllotmentSearchCriteriaRepoDO {
	status?: AllotmentStatus;
	customerId?: string;
	priceProductId?: string;
	roomCategoryId?: string;
	allotmentIdList?: string[];
}
export interface AllotmentSearchResultRepoDO {
	lazyLoad?: LazyLoadRepoDO;
	allotmentList: AllotmentDO[];
}

export interface IAllotmentRepository {
	getAllotmentListCount(meta: AllotmentMetaRepoDO, searchCriteria: AllotmentSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO>;
	getAllotmentList(meta: AllotmentMetaRepoDO, searchCriteria: AllotmentSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<AllotmentSearchResultRepoDO>;

	getAllotmentById(meta: AllotmentMetaRepoDO, allotmentId: string): Promise<AllotmentDO>;

	addAllotment(meta: AllotmentMetaRepoDO, allotment: AllotmentDO): Promise<AllotmentDO>;
	updateAllotment(meta: AllotmentMetaRepoDO, itemMeta: AllotmentItemMetaRepoDO, allotment: AllotmentDO): Promise<AllotmentDO>;
}