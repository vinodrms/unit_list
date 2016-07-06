import {IBusinessValidationRuleFilter} from '../../../../common/validation-rule-filters/IBusinessValidationRuleFilter';
import {RoomCategoryStatsDO} from '../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {ConfigCapacityDO} from '../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';

import _ = require('underscore');

export class RoomCategoryStatsFilter implements IBusinessValidationRuleFilter<RoomCategoryStatsDO> {
    constructor(private _referenceCapacity: ConfigCapacityDO) {
    }

    public filterSync(businessObjectList: RoomCategoryStatsDO[]): RoomCategoryStatsDO[] {
        var roomCategoryStatsList = businessObjectList;
        return _.filter(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
            return roomCategoryStats.capacity.canFit(this._referenceCapacity);
        });
    }
}