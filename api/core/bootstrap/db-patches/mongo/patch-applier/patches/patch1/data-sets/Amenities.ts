import {ABaseSetting} from './ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {AmenityDO} from '../../../../../../../data-layer/common/data-objects/amenity/AmenityDO';
import {AmenitySettingDO} from '../../../../../../../data-layer/settings/data-objects/amenity/AmenitySettingDO';

export class Amenities extends ABaseSetting {
    constructor() {
        super(SettingType.Amenities, "Hotel Amenities");
    }
    public getAmenitySettingDO(): AmenitySettingDO {
        var readAmenities = this.dataSet;
        var toAddAmenities: AmenityDO[] = [];
        readAmenities.forEach((readAmenity: { name: string, iconUrl: string }) => {
            var amenityDO = new AmenityDO();
            amenityDO.id = this._thUtils.generateUniqueID();
            amenityDO.iconUrl = readAmenity.iconUrl;
            amenityDO.name = readAmenity.name;
            toAddAmenities.push(amenityDO);
        });
        var amenitySettingDO = new AmenitySettingDO();
        amenitySettingDO.metadata = this.getSettingMetadata();
        amenitySettingDO.value = toAddAmenities;
        return amenitySettingDO;
    }

    private dataSet: { name: string, iconUrl: string }[] = [
        {
            name: "Parking",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "WiFi",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Bar",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Restaurant",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Pets Allowed",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Outside Pool",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Inside Pool",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Wellness",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Transfer",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Loundry Service",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        }
    ];
}