import {BedDO} from '../../common/data-objects/bed/BedDO';

export interface BedMetaRepoDO {
    hotelId: string;
}

export interface BedItemMetaRepoDO {
    id: string;
	versionId: number;
}

export interface IBedRepository {
    // getBedListForHotel(bedMeta: BedMetaRepoDO): Promise<BedDO[]>;
	// getBedForHotel(bedMeta: BedMetaRepoDO, bedId: string): Promise<BedDO>;

	addBed(bedMeta: BedMetaRepoDO, bed: BedDO): Promise<BedDO>;
	updateBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO, tax: BedDO): Promise<BedDO>;
	deleteBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO): Promise<BedDO>;
}