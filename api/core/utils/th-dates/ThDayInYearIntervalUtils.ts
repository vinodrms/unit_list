import {ThDayInYearIntervalDO} from './data-objects/ThDayInYearIntervalDO';
import {ThDayInYearDO} from './data-objects/ThDayInYearDO';
import {ThDayInYearComparator} from './ThDayInYearComparator';
import {IThInterval} from '../th-interval/IThInterval';
import {ThIntervalUtils} from '../th-interval/ThIntervalUtils';

export class ThDayInYearIntervalUtils extends ThIntervalUtils<ThDayInYearDO> {
	private static MinDay = 1;
	private static MaxDay = 31;
	private static MinMonth = 1;
	private static MaxMonth = 12;

	constructor(private _dayInYearIntervals: ThDayInYearIntervalDO[]) {
		super(_dayInYearIntervals, new ThDayInYearComparator());
	}
	protected substractOneUnitFrom(intervalBoundary: ThDayInYearDO): ThDayInYearDO {
		intervalBoundary.day--;
		if (intervalBoundary.day < ThDayInYearIntervalUtils.MinDay) {
			intervalBoundary.day = ThDayInYearIntervalUtils.MaxDay;
			intervalBoundary.month--;
			if (intervalBoundary.month < ThDayInYearIntervalUtils.MinMonth) {
				intervalBoundary.month = ThDayInYearIntervalUtils.MaxMonth;
			}
		}
		return intervalBoundary;
	}
	protected addOneUnitTo(intervalBoundary: ThDayInYearDO): ThDayInYearDO {
		intervalBoundary.day++;
		if (intervalBoundary.day > ThDayInYearIntervalUtils.MaxDay) {
			intervalBoundary.day = ThDayInYearIntervalUtils.MinDay;
			intervalBoundary.month++;
			if (intervalBoundary.month > ThDayInYearIntervalUtils.MaxMonth) {
				intervalBoundary.month = ThDayInYearIntervalUtils.MinMonth;
			}
		}
		return intervalBoundary;
	}
	protected buildNewInterval(start: ThDayInYearDO, end: ThDayInYearDO): IThInterval<ThDayInYearDO> {
		var newInterval = new ThDayInYearIntervalDO();
		newInterval.start = this.buildNewThDayInYearDO(start.day, start.month);
		newInterval.end = this.buildNewThDayInYearDO(end.day, end.month);
		return newInterval;
	}
	private buildNewThDayInYearDO(day: number, month: number): ThDayInYearDO {
		var dayDO = new ThDayInYearDO();
		dayDO.day = day;
		dayDO.month = month;
		return dayDO;
	}
}