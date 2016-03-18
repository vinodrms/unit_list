import {ABaseSetting} from './ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {YieldFilterValueDO} from '../../../../../../../data-layer/common/data-objects/yield-filter/YieldFilterValueDO';
import {YieldFilterDO, YieldFilterType} from '../../../../../../../data-layer/common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterSettingDO} from '../../../../../../../data-layer/settings/data-objects/yield-manager-filter/YieldManagerFilterSettingDO';

export class YieldManagerFilters extends ABaseSetting {
    private dataSet: { label: string, type: YieldFilterType, values: YieldFilterValueDO[] }[];
    
    constructor() {
        super(SettingType.YieldFilter, "Default Yield Manager Filters");
        this.init();
    }

    public getYieldManagerFilterSettingDO(): YieldFilterSettingDO {
        var readYieldManagerFilters = this.dataSet;
        var toAddFilters: YieldFilterDO[] = [];
        readYieldManagerFilters.forEach((readFilter: { label: string, type: YieldFilterType, values: YieldFilterValueDO[] }) => {
            var filterDO = new YieldFilterDO();
            filterDO.id = this._thUtils.generateUniqueID();
            filterDO.label = readFilter.label;
            filterDO.type = readFilter.type;
            filterDO.values = readFilter.values;
            toAddFilters.push(filterDO);
        });
        var yieldManagerFilterSettingDO = new YieldFilterSettingDO();
        yieldManagerFilterSettingDO.metadata = this.getSettingMetadata();
        yieldManagerFilterSettingDO.value = toAddFilters;
        return yieldManagerFilterSettingDO;
    }

    private init() {
        var yieldGroup = {
            label: "Yield Group",
            type: YieldFilterType.Text,
            values: []
        };
        var firstFilter = new YieldFilterValueDO();
        firstFilter.id = this._thUtils.generateUniqueID();
        firstFilter.description = "First Filter";
        firstFilter.label = "1";
        var secondFilter = new YieldFilterValueDO();
        secondFilter.id = this._thUtils.generateUniqueID();
        secondFilter.description = "Second Filter";
        secondFilter.label = "2";
        var thirdFilter = new YieldFilterValueDO();
        thirdFilter.id = this._thUtils.generateUniqueID();
        thirdFilter.description = "Third Filter";
        thirdFilter.label = "3";
        yieldGroup.values.push(firstFilter);
        yieldGroup.values.push(secondFilter);
        yieldGroup.values.push(thirdFilter);

        var yieldLevel = {
            label: "Yield Level",
            type: YieldFilterType.Color,
            values: []
        };
        var redFilter = new YieldFilterValueDO();
        redFilter.id = this._thUtils.generateUniqueID();
        redFilter.colorCode = "red";
        redFilter.description = "Red filter";
        var yellowFilter = new YieldFilterValueDO();
        yellowFilter.id = this._thUtils.generateUniqueID();
        yellowFilter.colorCode = "yellow";
        yellowFilter.description = "Yellow filter";
        var greenFilter = new YieldFilterValueDO();
        greenFilter.id = this._thUtils.generateUniqueID();
        greenFilter.colorCode = "green";
        greenFilter.description = "Green filter";
        
        yieldLevel.values.push(redFilter);
        yieldLevel.values.push(yellowFilter);
        yieldLevel.values.push(greenFilter);
        
        this.dataSet = [];
        this.dataSet.push(yieldGroup);
        this.dataSet.push(yieldLevel);
    }
}