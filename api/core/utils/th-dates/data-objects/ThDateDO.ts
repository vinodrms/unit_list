import {BaseDO} from '../../../data-layer/common/base/BaseDO';
import {ThDateUtils} from '../ThDateUtils';

import moment = require("moment");

export enum ThMonth {
	January,
	February,
	March,
	April,
	May,
	June,
	July,
	August,
	September,
	October,
	November,
	December
}

export class ThDateDO extends BaseDO {
    constructor() {
        super();
    }
    year: number;
	month: number;
	day: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["year", "month", "day"];
    }

	public isValid(): boolean {
		var thDateUtils = new ThDateUtils();
		var thisMoment = thDateUtils.convertThDateDOToMoment(this);
		return thisMoment.isValid();
	}

	public isBefore(otherDate: ThDateDO): boolean {
		var thDateUtils = new ThDateUtils();
		var thisMoment = thDateUtils.convertThDateDOToMoment(this);
		var otherMoment = thDateUtils.convertThDateDOToMoment(otherDate);
		return thisMoment.isBefore(otherMoment, "day");
	}
	public isAfter(otherDate: ThDateDO): boolean {
		var thDateUtils = new ThDateUtils();
		var thisMoment = thDateUtils.convertThDateDOToMoment(this);
		var otherMoment = thDateUtils.convertThDateDOToMoment(otherDate);
		return thisMoment.isAfter(otherMoment, "day");
	}
	public isSame(otherDate: ThDateDO): boolean {
		var thDateUtils = new ThDateUtils();
		var thisMoment = thDateUtils.convertThDateDOToMoment(this);
		var otherMoment = thDateUtils.convertThDateDOToMoment(otherDate);
		return thisMoment.isSame(otherMoment, "day");
	}

	public static buildThDateDO(year: number, month: number, day: number): ThDateDO {
		var outDate = new ThDateDO();
		outDate.year = year;
		outDate.month = month;
		outDate.day = day;
		return outDate;
	}
}