import {BaseDO} from '../../../common/base/BaseDO';
import {YieldFilterDO} from '../../../common/data-objects/yield-filter/YieldFilterDO';
import {HotelConfigurationMetadataDO} from '../common/HotelConfigurationMetadataDO';
import {HotelConfigurationDO} from '../HotelConfigurationDO';

export class YieldFilterConfigurationDO extends HotelConfigurationDO {
    metadata: HotelConfigurationMetadataDO;
    value: YieldFilterDO[];
    
    protected getPrimitivePropertyKeys(): string[] {
        return [].concat(super.getPrimitivePropertyKeys());
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new HotelConfigurationMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (yieldFilterObject: Object) => {
            var yieldFilterDO = new YieldFilterDO();
            yieldFilterDO.buildFromObject(yieldFilterObject);
            this.value.push(yieldFilterDO);
        });
    }
}