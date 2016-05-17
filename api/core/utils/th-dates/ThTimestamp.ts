import {ThDateDO} from './data-objects/ThDateDO';
import {ThHourDO} from './data-objects/ThHourDO';
import {ThDateUtils} from './ThDateUtils';

import moment = require('moment-timezone');

export class ThTimestamp {
	private static StartOfDayHour = 0;
	private static StartOfDayMaxMinute = 30;

	private _thDateDO: ThDateDO;
	private _thHourDO: ThHourDO;

	private _thDateUtils: ThDateUtils;

	constructor(private _timezoneString: string) {
		this._thDateUtils = new ThDateUtils();
		this.buildCurrentDateAndHour();
	}
	private buildCurrentDateAndHour() {
		var currentMoment: moment.Moment = moment.tz(this._timezoneString);
		this._thDateDO = this._thDateUtils.convertMomentToThDateDO(currentMoment);
		this._thHourDO = this._thDateUtils.convertMomentToThHourDO(currentMoment);
	}

	public getUtcTimestamp(): number {
		return Date.UTC(this._thDateDO.year, this._thDateDO.month, this._thDateDO.day, this._thHourDO.hour, this._thHourDO.minute);
	}
	public isStartOfDay(): boolean {
		return this._thHourDO.hour === ThTimestamp.StartOfDayHour && this._thHourDO.minute < ThTimestamp.StartOfDayMaxMinute;
	}

	public get thDateDO(): ThDateDO {
		return this._thDateDO;
	}
	public set thDateDO(thDateDO: ThDateDO) {
		this._thDateDO = thDateDO;
	}
	public get thHourDO(): ThHourDO {
		return this._thHourDO;
	}
	public set thHourDO(thHourDO: ThHourDO) {
		this._thHourDO = thHourDO;
	}
}