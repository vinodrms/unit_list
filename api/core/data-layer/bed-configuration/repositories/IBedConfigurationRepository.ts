import {BedConfigurationDO} from '../data-objects/BedConfigurationDO';

export interface IBedConfigurationRepository {
    
    addBedConfigurationAsync(bedConfiguration: BedConfigurationDO, finishAddBedConfigCallback: { (err: any, savedBedConfiguration?: BedConfigurationDO): void });
    
    getBedConfigurationByHotelIdAsync(hotelId: string, finishGetBedConfigByHotelIdCallback: { (err: any, bedConfiguration?: BedConfigurationDO): void });
        
}