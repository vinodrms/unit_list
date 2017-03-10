import {BaseDO} from '../../../data-layer/common/base/BaseDO';
import {ThDateUtils} from '../ThDateUtils';
import {ISOWeekDay} from './ISOWeekDay';

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
	month: ThMonth;
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
	public getISOWeekDay(): ISOWeekDay {
		var thDateUtils = new ThDateUtils();
		var thisMoment = thDateUtils.convertThDateDOToMoment(this);
		return thisMoment.isoWeekday();
	}
	public getUtcTimestamp(): number {
		return Date.UTC(this.year, this.month, this.day);
	}

	public buildPrototype(): ThDateDO {
		return ThDateDO.buildThDateDO(this.year, this.month, this.day);
	}

	public static buildThDateDO(year: number, month: number, day: number): ThDateDO {
		var outDate = new ThDateDO();
		outDate.year = year;
		outDate.month = month;
		outDate.day = day;
		return outDate;
	}
	
	public toString(): string {
		if (!_.isNumber(this.year) || !_.isNumber(this.month) || !_.isNumber(this.day)) {
			return "";
		}
		return this.getDayString() + "/" + this.getMonthString() + "/" + this.year;
	}
	private getDayString(): string {
		return this.day < 10 ? ("0" + this.day) : ("" + this.day);
	}
	private getMonthString(): string {
		var actualMonth = this.month + 1;
		return actualMonth < 10 ? ("0" + actualMonth) : ("" + actualMonth);
	}
}