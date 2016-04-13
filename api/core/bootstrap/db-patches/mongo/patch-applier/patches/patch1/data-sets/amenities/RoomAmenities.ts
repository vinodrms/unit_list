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
                iconUrl: "glyphicon glyphicon-music glyphicon-lg"
            },
            {
                name: "Hairdryer",
                iconUrl: "glyphicon glyphicon-lock glyphicon-lg"
            },
            {
                name: "Tv",
                iconUrl: "glyphicon glyphicon-camera glyphicon-lg"
            },
            {
                name: "Wifi",
                iconUrl: "glyphicon glyphicon-adjust glyphicon-lg"
            },
            {
                name: "AC",
                iconUrl: "glyphicon glyphicon-leaf glyphicon-lg"
            },
            {
                name: "Minibar",
                iconUrl: "glyphicon glyphicon-tasks glyphicon-lg"
            }
        ];

    }
}