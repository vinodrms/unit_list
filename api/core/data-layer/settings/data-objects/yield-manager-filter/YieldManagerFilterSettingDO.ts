import {BaseDO} from '../../../common/base/BaseDO';
import {SettingMetadataDO} from '../common/SettingMetadataDO';
import {YieldFilterDO} from '../../../common/data-objects/yield-filter/YieldFilterDO';

export class YieldFilterSettingDO extends BaseDO {
    metadata: SettingMetadataDO;
    value: YieldFilterDO[];
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new SettingMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (yieldFilterObject: Object) => {
            var yieldFilterDO = new YieldFilterDO();
            yieldFilterDO.buildFromObject(yieldFilterObject);
            this.value.push(yieldFilterDO);
        });
    }
}