import {YieldFilterType} from '../../../../common/data-objects/yield-filter/YieldFilterDO';

export interface IFilterVM {
    filterType: YieldFilterType;
    filterId: string;
    valueId: string;
}