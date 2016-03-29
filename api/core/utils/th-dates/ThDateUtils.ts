import {ThDateDO} from './data-objects/ThDateDO';

import moment = require('moment-timezone');

export class ThDateUtils {
	private static MinDateMillis = 0;
	private static MaxDateMillis = 8640000000000000;

	constructor() {
	}
	private getTimezoneList(): string[] {
		return moment.tz.names();
	}
	public isValidTimezone(timezone: string) {
		var timezoneList = this.getTimezoneList();
		return _.contains(timezoneList, timezone);
	}

	public getMinThDateDO(): ThDateDO {
		var day = moment(ThDateUtils.MinDateMillis);
		return this.convertMomentToThDateDO(day);
	}
	public getMaxThDateDO(): ThDateDO {
		var day = moment(ThDateUtils.MaxDateMillis);
		return this.convertMomentToThDateDO(day);
	}
	public addDaysToThDateDO(inDate: ThDateDO, days: number): ThDateDO {
		var inMoment = this.convertThDateDOToMoment(inDate);
		inMoment = inMoment.add(days, "day");
		return this.convertMomentToThDateDO(inMoment);
	}

	public convertThDateDOToMoment(inDate: ThDateDO): moment.Moment {
		return moment([inDate.year, inDate.month, inDate.day]);
	}
	private convertMomentToThDateDO(day: moment.Moment): ThDateDO {
		return ThDateDO.buildThDateDO(day.year(), day.month(), day.date());
	}
}