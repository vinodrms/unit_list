import {BedDO} from '../../common/data-objects/bed/BedDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';
export interface BedMetaRepoDO {
    hotelId: string;
}

export interface BedItemMetaRepoDO {
    id: string;
	versionId: number;
}

export interface BedSearchCriteriaRepoDO {
	bedIdList?: string[];
    name?: string;
}

export interface BedSearchResultRepoDO {
	lazyLoad?: LazyLoadRepoDO;
	bedList: BedDO[];
}


export interface IBedRepository {
    getBedList(bedMeta: BedMetaRepoDO, searchCriteria?: BedSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<BedSearchResultRepoDO>;
    getBedListCount(bedMeta: BedMetaRepoDO, searchCriteria?: BedSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO>;
	getBedById(bedMeta: BedMetaRepoDO, bedId: string): Promise<BedDO>;
    
	addBed(bedMeta: BedMetaRepoDO, bed: BedDO): Promise<BedDO>;
	updateBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO, tax: BedDO): Promise<BedDO>;
	deleteBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO): Promise<BedDO>;
}