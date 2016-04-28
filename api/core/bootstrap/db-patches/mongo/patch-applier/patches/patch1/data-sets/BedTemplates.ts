import {ABaseSetting} from './ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {BedTemplateDO} from '../../../../../../../data-layer/common/data-objects/bed-template/BedTemplateDO';
import {BedTemplateSettingDO} from '../../../../../../../data-layer/settings/data-objects/bed-template/BedTemplateSettingDO';

export class BedTemplates extends ABaseSetting {
    constructor() {
        super(SettingType.BedTemplates, "Bed Templates");
    }
    
    public getBedTemplateSettingDO(): BedTemplateSettingDO {
        var readBedTemplates = this.dataSet;
        var toAddBedTemplates: BedTemplateDO[] = [];
        readBedTemplates.forEach((readBedTemplate: { name: string, iconUrl: string }) => {
            var bedTemplateDO = new BedTemplateDO();
            bedTemplateDO.id = this._thUtils.generateUniqueID();
            bedTemplateDO.iconUrl = readBedTemplate.iconUrl;
            bedTemplateDO.name = readBedTemplate.name;
            toAddBedTemplates.push(bedTemplateDO);
        });
        var bedTemplateSettingDO = new BedTemplateSettingDO();
        bedTemplateSettingDO.metadata = this.getSettingMetadata();
        bedTemplateSettingDO.value = toAddBedTemplates;
        return bedTemplateSettingDO;
    }
    
    private dataSet: { name: string, iconUrl: string }[] = [
        {
            name: "Single Bed",
            iconUrl: "A"
        },
        {
            name: "Double Bed",
            iconUrl: "1"
        },
        {
            name: "Modular",
            iconUrl: "5"
        },
        {
            name: "Queen/King",
            iconUrl: "2"
        },
        {
            name: "Baby Crib/Cot",
            iconUrl: "6"
        },
        {
            name: "Stacked",
            iconUrl: "4"
        },
        {
            name: "Couch",
            iconUrl: "7"
        },
        {
            name: "Custom",
            iconUrl: "3"
        }
    ];        
} 