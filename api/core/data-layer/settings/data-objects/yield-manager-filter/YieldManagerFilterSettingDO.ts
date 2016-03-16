import {BaseDO} from '../../../common/base/BaseDO';
import {SettingMetadataDO} from '../common/SettingMetadataDO';
import {YieldManagerFilterDO} from '../../../common/data-objects/yield-manager-filter/YieldManagerFilterDO';

export class YieldManagerFilterSettingDO extends BaseDO {
    metadata: SettingMetadataDO;
    value: YieldManagerFilterDO[];
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new SettingMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (yieldManagerFilterObject: Object) => {
            var yieldManagerFilterDO = new YieldManagerFilterDO();
            yieldManagerFilterDO.buildFromObject(yieldManagerFilterObject);
            this.value.push(yieldManagerFilterDO);
        });
    }
}