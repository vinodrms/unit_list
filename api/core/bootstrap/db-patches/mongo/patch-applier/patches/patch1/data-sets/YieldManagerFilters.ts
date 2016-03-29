import {ABaseSetting} from './ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {YieldFilterValueDO} from '../../../../../../../data-layer/common/data-objects/yield-filter/YieldFilterValueDO';
import {YieldFilterDO, YieldFilterType} from '../../../../../../../data-layer/common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterSettingDO} from '../../../../../../../data-layer/settings/data-objects/yield-manager-filter/YieldManagerFilterSettingDO';

export class YieldManagerFilters extends ABaseSetting {
	private static NumYieldLevels = 10;
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
        var yieldLevel = {
            label: "Yield Level",
            type: YieldFilterType.Text,
            values: []
        };

		for (var level = 1; level <= YieldManagerFilters.NumYieldLevels; level++) {
			var firstFilter = new YieldFilterValueDO();
			firstFilter.id = this._thUtils.generateUniqueID();
			firstFilter.description = "";
			firstFilter.label = level + "";
			yieldLevel.values.push(firstFilter);
		}

        var yieldGroup = {
            label: "Yield Group",
            type: YieldFilterType.Color,
            values: []
        };
        var redFilter = new YieldFilterValueDO();
        redFilter.id = this._thUtils.generateUniqueID();
        redFilter.colorCode = "red";
        redFilter.description = "";
        var yellowFilter = new YieldFilterValueDO();
        yellowFilter.id = this._thUtils.generateUniqueID();
        yellowFilter.colorCode = "yellow";
        yellowFilter.description = "";
        var greenFilter = new YieldFilterValueDO();
        greenFilter.id = this._thUtils.generateUniqueID();
        greenFilter.colorCode = "green";
        greenFilter.description = "";

        yieldGroup.values.push(redFilter);
        yieldGroup.values.push(yellowFilter);
        yieldGroup.values.push(greenFilter);

        this.dataSet = [];
        this.dataSet.push(yieldLevel);
        this.dataSet.push(yieldGroup);
    }
}