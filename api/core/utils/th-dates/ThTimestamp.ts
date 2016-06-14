import {BaseDO} from '../../data-layer/common/base/BaseDO';
import {ThDateDO} from './data-objects/ThDateDO';
import {ThHourDO} from './data-objects/ThHourDO';
import {ThDateUtils} from './ThDateUtils';

import moment = require('moment-timezone');

export class ThTimestamp extends BaseDO {
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
		return this.thHourDO.hour === ThTimestamp.StartOfDayHour && this.thHourDO.minute < ThTimestamp.StartOfDayMaxMinute;
	}

	public static buildThTimestampForTimezone(timezoneString: string): ThTimestamp {
		var thDateUtils = new ThDateUtils();
		var currentMoment: moment.Moment = moment.tz(timezoneString);
		var thTimestamp = new ThTimestamp();
		thTimestamp.thDateDO = thDateUtils.convertMomentToThDateDO(currentMoment);
		thTimestamp.thHourDO = thDateUtils.convertMomentToThHourDO(currentMoment);
		return thTimestamp;
	}
}