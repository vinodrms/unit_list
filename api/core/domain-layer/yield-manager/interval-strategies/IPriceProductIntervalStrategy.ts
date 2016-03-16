import {ThDayInYearIntervalDO} from '../../../utils/th-dates/data-objects/ThDayInYearIntervalDO';

export interface IPriceProductIntervalStrategy {
	apply(intervalList: ThDayInYearIntervalDO[], interval: ThDayInYearIntervalDO): ThDayInYearIntervalDO[];
}