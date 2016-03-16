import {BaseDO} from '../../../common/base/BaseDO';
import {YieldManagerFilterDO} from '../../../common/data-objects/yield-manager-filter/YieldManagerFilterDO';
import {HotelConfigurationMetadataDO} from '../common/HotelConfigurationMetadataDO';
import {HotelConfigurationDO} from '../HotelConfigurationDO';

export class YieldManagerFilterConfigurationDO extends HotelConfigurationDO {
    metadata: HotelConfigurationMetadataDO;
    value: YieldManagerFilterDO[];
    
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new HotelConfigurationMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (yieldManagerFilterObject: Object) => {
            var yieldManagerFilterDO = new YieldManagerFilterDO();
            yieldManagerFilterDO.buildFromObject(yieldManagerFilterObject);
            this.value.push(yieldManagerFilterDO);
        });
    }
}