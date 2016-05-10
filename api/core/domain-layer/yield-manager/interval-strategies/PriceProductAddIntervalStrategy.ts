import {IPriceProductIntervalStrategy} from './IPriceProductIntervalStrategy';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateIntervalUtils} from '../../../utils/th-dates/ThDateIntervalUtils';

export class PriceProductAddIntervalStrategy implements IPriceProductIntervalStrategy {
	public apply(intervalList: ThDateIntervalDO[], interval: ThDateIntervalDO): ThDateIntervalDO[] {
		var intervalUtils = new ThDateIntervalUtils(intervalList);
		intervalUtils.addInterval(interval);
		return <ThDateIntervalDO[]>intervalUtils.getProcessedIntervals();
	}
}