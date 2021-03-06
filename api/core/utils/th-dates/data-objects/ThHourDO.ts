import {BaseDO} from '../../../data-layer/common/base/BaseDO';

import _ = require("underscore");

export class ThHourDO extends BaseDO {
	private static NoMillisInAnHour = 3600000;
	private static NoMillisInAMinute = 60000;

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
		return _.isNumber(this.hour) && ThHourDO.MinHourOfDay <= this.hour && this.hour <= ThHourDO.MaxHourOfDay;
	}
	private isValidMinute(): boolean {
		return _.isNumber(this.minute) && ThHourDO.MinMinuteOfHour <= this.minute && this.minute <= ThHourDO.MaxMinuteOfHour;
	}

	public static buildThHourDO(hour: number, minute: number): ThHourDO {
		var hourDO = new ThHourDO();
		hourDO.hour = hour;
		hourDO.minute = minute;
		return hourDO;
	}

	public toString(): string {
		return this.addLeftPaddingIfNeccessary(this.hour) + ":" + this.addLeftPaddingIfNeccessary(this.minute);
    }
	private addLeftPaddingIfNeccessary(hourOrMinute: number): string {
		if (hourOrMinute < 10) {
            return '0' + hourOrMinute;
        }
		return hourOrMinute + '';
	}

	public getMillis(): number {
		return (this.hour * ThHourDO.NoMillisInAnHour) + (this.minute * ThHourDO.NoMillisInAMinute);
	}
	public buildPrototype(): ThHourDO {
		return ThHourDO.buildThHourDO(this.hour, this.minute);
	}
}