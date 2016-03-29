import {BedDO} from '../../common/data-objects/bed/BedDO';

export interface BedMetaRepoDO {
    hotelId: string;
}

export interface BedItemMetaRepoDO {
    id: string;
	versionId: number;
}

export interface BedSearchCriteriaRepoDO {
	bedIdList?: string[];
}

export interface IBedRepository {
    getBedList(bedMeta: BedMetaRepoDO, searchCriteria?: BedSearchCriteriaRepoDO): Promise<BedDO[]>;
	getBedById(bedMeta: BedMetaRepoDO, bedId: string): Promise<BedDO>;
    
	addBed(bedMeta: BedMetaRepoDO, bed: BedDO): Promise<BedDO>;
	updateBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO, tax: BedDO): Promise<BedDO>;
	deleteBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO): Promise<BedDO>;
}