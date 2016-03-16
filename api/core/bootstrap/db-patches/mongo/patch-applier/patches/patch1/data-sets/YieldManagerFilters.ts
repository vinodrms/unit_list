import {ABaseSetting} from './ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {YieldManagerFilterValueDO} from '../../../../../../../data-layer/common/data-objects/yield-manager-filter/YieldManagerFilterValueDO';
import {YieldManagerFilterDO, YieldManagerFilterType} from '../../../../../../../data-layer/common/data-objects/yield-manager-filter/YieldManagerFilterDO';
import {YieldManagerFilterSettingDO} from '../../../../../../../data-layer/settings/data-objects/yield-manager-filter/YieldManagerFilterSettingDO';

export class YieldManagerFilters extends ABaseSetting {
    private dataSet: { label: string, type: YieldManagerFilterType, values: YieldManagerFilterValueDO[] }[];
    
    constructor() {
        super(SettingType.YieldManagerFilter, "Default Yield Manager Filters");
        this.init();
    }

    public getYieldManagerFilterSettingDO(): YieldManagerFilterSettingDO {
        var readYieldManagerFilters = this.dataSet;
        var toAddFilters: YieldManagerFilterDO[] = [];
        readYieldManagerFilters.forEach((readFilter: { label: string, type: YieldManagerFilterType, values: YieldManagerFilterValueDO[] }) => {
            var filterDO = new YieldManagerFilterDO();
            filterDO.id = this._thUtils.generateUniqueID();
            filterDO.label = readFilter.label;
            filterDO.type = readFilter.type;
            filterDO.values = readFilter.values;
            toAddFilters.push(filterDO);
        });
        var yieldManagerFilterSettingDO = new YieldManagerFilterSettingDO();
        yieldManagerFilterSettingDO.metadata = this.getSettingMetadata();
        yieldManagerFilterSettingDO.value = toAddFilters;
        return yieldManagerFilterSettingDO;
    }

    private init() {
        var yieldGroup = {
            label: "Yield Group",
            type: YieldManagerFilterType.Text,
            values: []
        };
        var firstFilter = new YieldManagerFilterValueDO();
        firstFilter.id = this._thUtils.generateUniqueID();
        firstFilter.description = "First Filter";
        firstFilter.label = "1";
        var secondFilter = new YieldManagerFilterValueDO();
        secondFilter.id = this._thUtils.generateUniqueID();
        secondFilter.description = "Second Filter";
        secondFilter.label = "2";
        var thirdFilter = new YieldManagerFilterValueDO();
        thirdFilter.id = this._thUtils.generateUniqueID();
        thirdFilter.description = "Third Filter";
        thirdFilter.label = "3";
        yieldGroup.values.push(firstFilter);
        yieldGroup.values.push(secondFilter);
        yieldGroup.values.push(thirdFilter);

        var yieldLevel = {
            label: "Yield Level",
            type: YieldManagerFilterType.Color,
            values: []
        };
        var redFilter = new YieldManagerFilterValueDO();
        redFilter.id = this._thUtils.generateUniqueID();
        redFilter.colorCode = "red";
        redFilter.description = "Red filter";
        var yellowFilter = new YieldManagerFilterValueDO();
        yellowFilter.id = this._thUtils.generateUniqueID();
        yellowFilter.colorCode = "yellow";
        yellowFilter.description = "Yellow filter";
        var greenFilter = new YieldManagerFilterValueDO();
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