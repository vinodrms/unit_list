import { ThDateDO } from './data-objects/ThDateDO';
import { ThHourDO } from './data-objects/ThHourDO';
import { ThTimestampDO } from './data-objects/ThTimestampDO';

import moment = require('moment-timezone');
import _ = require("underscore");

export type ThUnitOfTime =
	"isoWeek"
	| "month";

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
	public getTodayThDayeDO(): ThDateDO {
		return this.convertMomentToThDateDO(moment());
	}
	public addDaysToThDateDO(inDate: ThDateDO, days: number): ThDateDO {
		var inMoment = this.convertThDateDOToMoment(inDate);
		inMoment = inMoment.add(days, "day");
		return this.convertMomentToThDateDO(inMoment);
	}
	public addYearsToThDateDO(inDate: ThDateDO, years: number): ThDateDO {
		var inMoment = this.convertThDateDOToMoment(inDate);
		inMoment = inMoment.add(years, "year");
		return this.convertMomentToThDateDO(inMoment);
	}

	public convertThDateDOToMoment(inDate: ThDateDO): moment.Moment {
		return moment([inDate.year, inDate.month, inDate.day]);
	}
	public convertMomentToThDateDO(day: moment.Moment): ThDateDO {
		return ThDateDO.buildThDateDO(day.year(), day.month(), day.date());
	}
	public convertMomentToThHourDO(day: moment.Moment): ThHourDO {
		return ThHourDO.buildThHourDO(day.hour(), day.minute());
	}
	public addThirtyMinutesToThTimestampDO(thTimestamp: ThTimestampDO): ThTimestampDO {
		var newTimestamp = thTimestamp.buildPrototype();
		newTimestamp.thHourDO.minute += 30;
		if (newTimestamp.thHourDO.minute < 60) {
			return newTimestamp;
		}
		newTimestamp.thHourDO.minute = 60 - newTimestamp.thHourDO.minute;
		newTimestamp.thHourDO.hour++;
		if (newTimestamp.thHourDO.hour < 24) {
			return newTimestamp;
		}
		newTimestamp.thHourDO.hour = 24 - newTimestamp.thHourDO.hour;
		newTimestamp.thDateDO = this.addDaysToThDateDO(newTimestamp.thDateDO, 1);
		return newTimestamp;
	}
	public startOf(inDate: ThDateDO, unitOfTime: ThUnitOfTime): ThDateDO {
		let moment = this.convertThDateDOToMoment(inDate).startOf(unitOfTime);
		return this.convertMomentToThDateDO(moment);
	}
	public endOf(inDate: ThDateDO, unitOfTime: ThUnitOfTime): ThDateDO {
		let moment = this.convertThDateDOToMoment(inDate).endOf(unitOfTime);
		return this.convertMomentToThDateDO(moment);
	}
}