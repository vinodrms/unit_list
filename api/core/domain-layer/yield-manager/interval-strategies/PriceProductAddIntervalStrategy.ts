import {IPriceProductIntervalStrategy} from './IPriceProductIntervalStrategy';
import {ThDayInYearIntervalDO} from '../../../utils/th-dates/data-objects/ThDayInYearIntervalDO';
import {ThDateIntervalUtils} from '../../../utils/th-dates/ThDateIntervalUtils';

export class PriceProductAddIntervalStrategy implements IPriceProductIntervalStrategy {
	public apply(intervalList: ThDayInYearIntervalDO[], interval: ThDayInYearIntervalDO): ThDayInYearIntervalDO[] {
		var intervalUtils = new ThDateIntervalUtils(intervalList);
		intervalUtils.addInterval(interval);
		return <ThDayInYearIntervalDO[]>intervalUtils.getProcessedIntervals();
	}
}