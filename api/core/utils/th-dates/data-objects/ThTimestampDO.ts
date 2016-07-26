import {BaseDO} from '../../../data-layer/common/base/BaseDO';
import {ThDateDO} from './ThDateDO';
import {ThHourDO} from './ThHourDO';
import {ThDateUtils} from '../ThDateUtils';

import moment = require('moment-timezone');

export class ThTimestampDO extends BaseDO {
	private static StartOfDayHour = 0;
	private static StartOfDayMaxMinute = 30;

	thDateDO: ThDateDO;
	thHourDO: ThHourDO;

	constructor() {
		super();
	}
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.thDateDO = new ThDateDO();
        this.thDateDO.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "thDateDO"));

		this.thHourDO = new ThHourDO();
        this.thHourDO.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "thHourDO"));
    }
	public getUtcTimestamp(): number {
		return Date.UTC(this.thDateDO.year, this.thDateDO.month, this.thDateDO.day, this.thHourDO.hour, this.thHourDO.minute);
	}
	public isStartOfDay(): boolean {
		return this.thHourDO.hour === ThTimestampDO.StartOfDayHour && this.thHourDO.minute < ThTimestampDO.StartOfDayMaxMinute;
	}
	public isValid(): boolean {
		return this.thDateDO.isValid() && this.thHourDO.isValid();
	}
	public toString(): string {
		return this.thDateDO.toString() + " " + this.thHourDO.toString();
    }

	public static buildThTimestampForTimezone(timezoneString: string): ThTimestampDO {
		var thDateUtils = new ThDateUtils();
		var currentMoment: moment.Moment = moment.tz(timezoneString);
		var thTimestamp = new ThTimestampDO();
		thTimestamp.thDateDO = thDateUtils.convertMomentToThDateDO(currentMoment);
		thTimestamp.thHourDO = thDateUtils.convertMomentToThHourDO(currentMoment);
		return thTimestamp;
	}
	public static buildThTimestampDO(thDateDO: ThDateDO, thHourDO: ThHourDO): ThTimestampDO {
		var thTimestamp = new ThTimestampDO();
		thTimestamp.thDateDO = thDateDO;
		thTimestamp.thHourDO = thHourDO;
		return thTimestamp;
	}
}