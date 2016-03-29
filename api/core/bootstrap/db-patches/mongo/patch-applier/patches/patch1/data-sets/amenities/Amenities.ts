import {ABaseSetting} from '../ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {AmenityDO} from '../../../../../../../../data-layer/common/data-objects/amenity/AmenityDO';
import {AmenitySettingDO} from '../../../../../../../../data-layer/settings/data-objects/amenity/AmenitySettingDO';

export abstract class Amenities extends ABaseSetting {
    protected dataSet: { name: string, iconUrl: string }[];
     
    constructor(settingType: SettingType, name: string) {
        super(settingType, name);
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

}