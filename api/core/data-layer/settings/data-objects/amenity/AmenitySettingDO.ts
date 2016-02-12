import {BaseDO} from '../../../common/base/BaseDO';
import {SettingMetadataDO} from '../common/SettingMetadataDO';
import {AmenityDO} from '../../../common/data-objects/amenity/AmenityDO';

export class AmenitySettingDO extends BaseDO {
    metadata: SettingMetadataDO;
    value: AmenityDO[];
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new SettingMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (amenityObject: Object) => {
            var amenityDO = new AmenityDO();
            amenityDO.buildFromObject(amenityObject);
            this.value.push(amenityDO);
        });
    }
}