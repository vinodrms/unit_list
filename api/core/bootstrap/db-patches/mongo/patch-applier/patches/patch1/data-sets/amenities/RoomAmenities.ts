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
                name: "Street View",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Park View",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Sea View",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Courtyard View",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Near Elevator",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Wheelchair Friendly",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Smoking",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Non-Smoking",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Balcony",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Terrace",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Garden Access",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Pool Access",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            },
            {
                name: "Bay Window",
                iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
            }
        ];

    }
}