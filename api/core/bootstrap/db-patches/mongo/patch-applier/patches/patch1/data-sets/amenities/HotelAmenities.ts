import {ABaseSetting} from '../ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {AmenityDO} from '../../../../../../../../data-layer/common/data-objects/amenity/AmenityDO';
import {AmenitySettingDO} from '../../../../../../../../data-layer/settings/data-objects/amenity/AmenitySettingDO';
import {Amenities} from './Amenities';

export class HotelAmenities extends Amenities {
    constructor() {
        super(SettingType.HotelAmenities, "Hotel Amenities");

        this.dataSet = [
            {
                name: "Parking",
                iconUrl: "À"
            },
            {
                name: "Laundry Service",
                iconUrl: "Á"
            },
            {
                name: "WiFi",
                iconUrl: "Â"
            },
            {
                name: "Bar",
                iconUrl: "Ã"
            },
            {
                name: "Restaurant",
                iconUrl: "Ä"
            },
            {
                name: "24/7 Reception",
                iconUrl: "Å"    
            },
            {
                name: "Currency Exchange",
                iconUrl: "Æ"    
            },
            {
                name: "Luggage storage",
                iconUrl: "Ç"    
            },
            {
                name: "Transfer",
                iconUrl: "È"    
            },
            {
                name: "Gym",
                iconUrl: "É"
            },
            {
                name: "Pool",
                iconUrl: "Ý"    
            },
            {
                name: "Wellness",
                iconUrl: "Ê"
            },
            {
                name: "Pets Allowed",
                iconUrl: "Ë"
            },
            {
                name: "Room Service",
                iconUrl: "Ì"
            }
        ];

    }
}