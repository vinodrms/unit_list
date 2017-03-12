import { ABaseSetting } from '../ABaseSetting';
import { SettingMetadataDO, SettingType } from '../../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import { AmenityDO } from '../../../../../../../../data-layer/common/data-objects/amenity/AmenityDO';
import { AmenitySettingDO } from '../../../../../../../../data-layer/settings/data-objects/amenity/AmenitySettingDO';
import { Amenities } from './Amenities';

export class RoomAmenities extends Amenities {
    constructor() {
        super(SettingType.RoomAmenities, "Room Amenities");

        this.dataSet = [
            {
                name: "Minibar",
                iconUrl: "Í"
            },
            {
                name: "Aircondition (AC)",
                iconUrl: "Î"
            },
            {
                name: "Tea/Coffee",
                iconUrl: "Ï"
            },
            {
                name: "Wifi",
                iconUrl: "Â"
            },
            {
                name: "Tv",
                iconUrl: "Ð"
            },
            {
                name: "Pets (allowed)",
                iconUrl: "Ë"
            },
            {
                name: "Bath tub",
                iconUrl: "Ñ"
            },
            {
                name: "Hairdryer",
                iconUrl: "Ó"
            },
            {
                name: "Iron Board",
                iconUrl: "Ò"
            },
            {
                name: "Kitchen",
                iconUrl: "Ô"
            },
            {
                name: "Shower",
                iconUrl: "ã",
            },
            {
                name: "Toilet",
                iconUrl: "ä"
            }
        ];

    }
}