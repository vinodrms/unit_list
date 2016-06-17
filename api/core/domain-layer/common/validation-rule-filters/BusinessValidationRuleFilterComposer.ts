import {IBusinessValidationRuleFilter} from './IBusinessValidationRuleFilter';

import _ = require('underscore');

export class BusinessValidationRuleFilterComposer<T> implements IBusinessValidationRuleFilter<T> {
    constructor(private _businessRuleFilterList: IBusinessValidationRuleFilter<T>[]) {
    }

    public filterSync(businessObjectList: T[]): T[] {
        var currentBusinessObjectList = businessObjectList;
        _.forEach(this._businessRuleFilterList, (validationRuleFilter: IBusinessValidationRuleFilter<T>) => {
            currentBusinessObjectList = validationRuleFilter.filterSync(businessObjectList);
        });
        return currentBusinessObjectList;
    }
}