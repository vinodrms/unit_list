import {BaseDO} from '../../../common/base/BaseDO';
import {SettingMetadataDO} from '../common/SettingMetadataDO';
import {BedTemplateDO} from '../../../common/data-objects/bed-template/BedTemplateDO';

export class BedTemplateSettingDO extends BaseDO {
    metadata: SettingMetadataDO;
    value: BedTemplateDO[];
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new SettingMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (bedTemplateObject: Object) => {
            var bedTemplateDO = new BedTemplateDO();
            bedTemplateDO.buildFromObject(bedTemplateObject);
            this.value.push(bedTemplateDO);
        });
    }
}