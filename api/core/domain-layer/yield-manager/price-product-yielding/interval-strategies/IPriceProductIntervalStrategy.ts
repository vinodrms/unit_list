import {ThDateIntervalDO} from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';

export interface IPriceProductIntervalStrategy {
	apply(intervalList: ThDateIntervalDO[], interval: ThDateIntervalDO): ThDateIntervalDO[];
}