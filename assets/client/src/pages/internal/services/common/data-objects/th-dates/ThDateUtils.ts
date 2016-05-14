import {ThDateDO} from './ThDateDO';
import {ThDateIntervalDO} from './ThDateIntervalDO';

export class ThDateUtils {
	private static MinDateMillis = 0;
	private static MaxDateMillis = 8640000000000000;

	constructor() {
	}

	public getMinThDateDO(): ThDateDO {
		var day = moment(ThDateUtils.MinDateMillis);
		return this.convertMomentToThDateDO(day);
	}
	public getMaxThDateDO(): ThDateDO {
		var day = moment(ThDateUtils.MaxDateMillis);
		return this.convertMomentToThDateDO(day);
	}
	public getTodayThDayeDO(): ThDateDO {
		return this.convertMomentToThDateDO(moment());
	}
	public getTodayToTomorrowInterval(): ThDateIntervalDO {
		var newDateInterval = new ThDateIntervalDO();
		newDateInterval.start = this.getTodayThDayeDO();
		newDateInterval.end = this.addDaysToThDateDO(newDateInterval.start.buildPrototype(), 1);
		return newDateInterval;
	}

	public addDaysToThDateDO(inDate: ThDateDO, days: number): ThDateDO {
		var inMoment = this.convertThDateDOToMoment(inDate);
		inMoment = inMoment.add(days, "day");
		return this.convertMomentToThDateDO(inMoment);
	}

	public convertThDateDOToMoment(inDate: ThDateDO): moment.Moment {
		return moment([inDate.year, inDate.month, inDate.day]);
	}
	public convertMomentToThDateDO(day: moment.Moment): ThDateDO {
		return ThDateDO.buildThDateDO(day.year(), day.month(), day.date());
	}
}