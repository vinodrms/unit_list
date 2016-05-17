import {ABaseSetting} from './ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {BedTemplateDO} from '../../../../../../../data-layer/common/data-objects/bed-template/BedTemplateDO';
import {BedTemplateSettingDO} from '../../../../../../../data-layer/settings/data-objects/bed-template/BedTemplateSettingDO';
import {BedAccommodationType} from '../../../../../../../data-layer/common/data-objects/bed/BedDO';

export class BedTemplates extends ABaseSetting {
    constructor() {
        super(SettingType.BedTemplates, "Bed Templates");
    }
    
    public getBedTemplateSettingDO(): BedTemplateSettingDO {
        var readBedTemplates = this.dataSet;
        var toAddBedTemplates: BedTemplateDO[] = [];
        readBedTemplates.forEach((readBedTemplate: { name: string, iconUrl: string, accommodationType: BedAccommodationType }) => {
            var bedTemplateDO = new BedTemplateDO();
            bedTemplateDO.id = this._thUtils.generateUniqueID();
            bedTemplateDO.iconUrl = readBedTemplate.iconUrl;
            bedTemplateDO.name = readBedTemplate.name;
            bedTemplateDO.accommodationType = readBedTemplate.accommodationType;
            toAddBedTemplates.push(bedTemplateDO);
        });
        var bedTemplateSettingDO = new BedTemplateSettingDO();
        bedTemplateSettingDO.metadata = this.getSettingMetadata();
        bedTemplateSettingDO.value = toAddBedTemplates;
        return bedTemplateSettingDO;
    }
    
    private dataSet: { name: string, iconUrl: string, accommodationType: BedAccommodationType }[] = [
        {
            name: "Single Bed",
            iconUrl: "A",
            accommodationType: BedAccommodationType.AdultsAndChildren
        },
        {
            name: "Double Bed",
            iconUrl: "1",
            accommodationType: BedAccommodationType.AdultsAndChildren
        },
        {
            name: "Modular",
            iconUrl: "5",
            accommodationType: BedAccommodationType.AdultsAndChildren
        },
        {
            name: "Queen/King",
            iconUrl: "2",
            accommodationType: BedAccommodationType.AdultsAndChildren
        },
        {
            name: "Baby Crib/Cot",
            iconUrl: "6",
            accommodationType: BedAccommodationType.Babies
        },
        {
            name: "Stacked",
            iconUrl: "4",
            accommodationType: BedAccommodationType.AdultsAndChildren
        },
        {
            name: "Couch",
            iconUrl: "7",
            accommodationType: BedAccommodationType.AdultsAndChildren
        },
        {
            name: "Custom",
            iconUrl: "3",
            accommodationType: BedAccommodationType.AdultsAndChildren
        }
    ];        
} 