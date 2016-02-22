import {BaseDO} from '../../../common/base/BaseDO';
import _ = require("underscore");

export class HourDO extends BaseDO {
	private static MinHourOfDay = 0;
	private static MaxHourOfDay = 23;

	private static MinMinuteOfHour = 0;
	private static MaxMinuteOfHour = 59;

	constructor() {
		super();
	}
	hour: number;
	minute: number;
	protected getPrimitivePropertyKeys(): string[] {
		return ["hour", "minute"];
	}
	public isValid(): boolean {
		return this.isValidHour() && this.isValidMinute();
	}
	private isValidHour(): boolean {
		return _.isNumber(this.hour) && HourDO.MinHourOfDay <= this.hour && this.hour <= HourDO.MaxHourOfDay;
	}
	private isValidMinute(): boolean {
		return _.isNumber(this.minute) && HourDO.MinMinuteOfHour <= this.minute && this.minute <= HourDO.MaxMinuteOfHour;
	}
}