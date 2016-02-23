import {BedDO} from '../../common/data-objects/bed/BedDO';

export interface BedMetaRepoDO {
    id: string;
	versionId: number;
}

export interface IBedRepository {
    
    createBedListAsync(bed: BedDO[], finishAddBedCallback: { (err: any, savedBedList?: BedDO[]): void });
    
    saveBedAsync(bedList: BedDO, finishAddBedCallback: { (err: any, savedBed?: BedDO): void });
    
    getBedListByHotelIdAsync(hotelId: string, finishGetBedByHotelIdCallback: { (err: any, bedList?: BedDO[]): void });
    
    testPromiseChain();
    
    updateBed(bed: BedDO): Promise<BedDO>;
}