import {ABaseSetting} from '../ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {AmenityDO} from '../../../../../../../../data-layer/common/data-objects/amenity/AmenityDO';
import {AmenitySettingDO} from '../../../../../../../../data-layer/settings/data-objects/amenity/AmenitySettingDO';
import {Amenities} from './Amenities';

export class RoomAmenities extends Amenities {
    constructor() {
        super(SettingType.RoomAmenities, "Room Amenities");

        this.dataSet = [
            {
                name: "Bath tub",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Hairdryer",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Tv",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Wifi",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "AC",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Minibar",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            }
        ];

    }
}