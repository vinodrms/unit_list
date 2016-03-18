import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestUtils} from '../../../../helpers/TestUtils';
import {SaveYieldFilterValueDO} from '../../../../../core/domain-layer/hotel-configurations/yield-filter/SaveYieldFilterValueDO';
import {YieldFilterType, YieldFilterDO} from '../../../../../core/data-layer/common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterConfigurationDO} from '../../../../../core/data-layer/hotel-configurations/data-objects/yield-filter/YieldFilterConfigurationDO';
import {YieldFilterValueDO} from '../../../../../core/data-layer/common/data-objects/yield-filter/YieldFilterValueDO';

import should = require('should');
import _ = require('underscore');

export class YieldFilterTestHelper {
    private _testUtils: TestUtils;

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
        this._testUtils = new TestUtils();
    }

    public getValidTextYieldFilterValueDO(): SaveYieldFilterValueDO {
        var saveYieldFilterValueDO = new SaveYieldFilterValueDO();
        saveYieldFilterValueDO.filterId = this.getFilterIdByType(YieldFilterType.Text);
        saveYieldFilterValueDO.description = "Fourth filter";
        saveYieldFilterValueDO.label = "4";
        return saveYieldFilterValueDO;
    }

    public getValidColorYieldFilterValueDO(): SaveYieldFilterValueDO {
        var saveYieldFilterValueDO = new SaveYieldFilterValueDO();
        saveYieldFilterValueDO.filterId = this.getFilterIdByType(YieldFilterType.Color);
        saveYieldFilterValueDO.description = "Fourth filter";
        saveYieldFilterValueDO.colorCode = "black";
        return saveYieldFilterValueDO;
    }

    public getInvalidColorYieldFilterValueDO(): SaveYieldFilterValueDO {
        var saveYieldFilterValueDO = new SaveYieldFilterValueDO();
        saveYieldFilterValueDO.filterId = this.getFilterIdByType(YieldFilterType.Color);
        saveYieldFilterValueDO.description = "Fifth filter";
        saveYieldFilterValueDO.label = "10";
        return saveYieldFilterValueDO;
    }

    public getInvalidTextYieldFilterValueDO(): SaveYieldFilterValueDO {
        var saveYieldFilterValueDO = new SaveYieldFilterValueDO();
        saveYieldFilterValueDO.filterId = this.getFilterIdByType(YieldFilterType.Text);
        saveYieldFilterValueDO.description = "Fifth filter";
        saveYieldFilterValueDO.colorCode = "pink";
        return saveYieldFilterValueDO;
    }

    public getTextSaveYieldFilterValueDOFrom(yieldFilterConfiguration: YieldFilterConfigurationDO): SaveYieldFilterValueDO {
        var filterId = this.getFilterIdByType(YieldFilterType.Text);
        var foundYieldFilter = _.findWhere(yieldFilterConfiguration.value, {id: filterId});
        var yieldFilterValue: YieldFilterValueDO = _.last(foundYieldFilter.values)
        var result = {
            description: yieldFilterValue.description,
            label: yieldFilterValue.label,
            filterId: filterId,
            colorCode: ''    
        };
        result["id"] = yieldFilterValue.id;
        delete result.colorCode;
        
        return result;
    }
    
    public getColorSaveYieldFilterValueDOFrom(yieldFilterConfiguration: YieldFilterConfigurationDO): SaveYieldFilterValueDO {
        var filterId = this.getFilterIdByType(YieldFilterType.Color);
        var foundYieldFilter = _.findWhere(yieldFilterConfiguration.value, {id: filterId});
        var yieldFilterValue: YieldFilterValueDO = _.last(foundYieldFilter.values)
        var result = {
            description: yieldFilterValue.description,
            label: '',
            filterId: filterId,
            colorCode: yieldFilterValue.colorCode    
        };
        result["id"] = yieldFilterValue.id;
        delete result.label;
        
        return result;
    }
    
    private getFilterIdByType(yieldFilterType: YieldFilterType): string {
        var filterId: string;

        this._defaultDataBuilder.yieldFilters.forEach((yieldFilter) => {
            if (yieldFilter.type === yieldFilterType) {
                filterId = yieldFilter.id;
            }
        });

        return filterId;
    }
}