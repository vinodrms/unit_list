import {ThDateIntervalDO} from './data-objects/ThDateIntervalDO';
import {ThDateDO} from './data-objects/ThDateDO';
import {ThDateComparator} from './ThDateComparator';
import {IThInterval} from '../th-interval/IThInterval';
import {ThIntervalUtils} from '../th-interval/ThIntervalUtils';
import {ThDateUtils} from './ThDateUtils';

export class ThDateIntervalUtils extends ThIntervalUtils<ThDateDO> {
	private _thDateUtils: ThDateUtils;

	constructor(private _dayInYearIntervals: ThDateIntervalDO[]) {
		super(_dayInYearIntervals, new ThDateComparator());
		this._thDateUtils = new ThDateUtils();
	}
	protected substractOneUnitFrom(intervalBoundary: ThDateDO): ThDateDO {
		return this._thDateUtils.addDaysToThDateDO(intervalBoundary, -1);
	}
	protected addOneUnitTo(intervalBoundary: ThDateDO): ThDateDO {
		return this._thDateUtils.addDaysToThDateDO(intervalBoundary, 1);
	}
	protected buildNewInterval(start: ThDateDO, end: ThDateDO): IThInterval<ThDateDO> {
		var newInterval = new ThDateIntervalDO();
		newInterval.start = ThDateDO.buildThDateDO(start.year, start.month, start.day);
		newInterval.end = ThDateDO.buildThDateDO(end.year, end.month, end.day);
		return newInterval;
	}

	public containsThDateDO(thDate: ThDateDO): boolean {
		var interval: ThDateIntervalDO = ThDateIntervalDO.buildThDateIntervalDO(thDate, thDate);
		return this.containsThDateIntervalDO(interval);
	}
	public containsThDateIntervalDO(thDateInterval: ThDateIntervalDO): boolean {
		for (var index = 0; index < this._dayInYearIntervals.length; index++) {
			var innerInterval: ThDateIntervalDO = this._dayInYearIntervals[index];
			if (this._comparator.compare(innerInterval.start, thDateInterval.start) <= 0 && this._comparator.compare(thDateInterval.end, innerInterval.end) <= 0) {
				return true;
			}
		}
		return false;
	}
}