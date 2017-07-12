import {BaseDO} from '../../../../../../common/base/BaseDO';

import * as _ from "underscore";

export class ThHourDO extends BaseDO {
	public static MinHourOfDay = 0;
	public static MaxHourOfDay = 23;

	public static MinMinuteOfHour = 0;
	public static MaxMinuteOfHour = 59;

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
	public isSame(otherHour: ThHourDO): boolean {
		return this.hour === otherHour.hour && this.minute === otherHour.minute;
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

	public static buildThHourDO(hour: number, minute): ThHourDO {
		var outHour = new ThHourDO();
		outHour.hour = hour;
		outHour.minute = minute;
		return outHour;
	}
	public buildPrototype(): ThHourDO {
		return ThHourDO.buildThHourDO(this.hour, this.minute);
	}
}