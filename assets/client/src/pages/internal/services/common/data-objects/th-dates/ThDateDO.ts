import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThDateUtils} from './ThDateUtils';
import {ISOWeekDay, ISOWeekDayUtils} from './ISOWeekDay';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

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

var ThMonthDisplayString: { [index: number]: string; } = {};
ThMonthDisplayString[ThMonth.January] = "January";
ThMonthDisplayString[ThMonth.February] = "February";
ThMonthDisplayString[ThMonth.March] = "March";
ThMonthDisplayString[ThMonth.April] = "April";
ThMonthDisplayString[ThMonth.May] = "May";
ThMonthDisplayString[ThMonth.June] = "June";
ThMonthDisplayString[ThMonth.July] = "July";
ThMonthDisplayString[ThMonth.August] = "August";
ThMonthDisplayString[ThMonth.September] = "September";
ThMonthDisplayString[ThMonth.October] = "October";
ThMonthDisplayString[ThMonth.November] = "November";
ThMonthDisplayString[ThMonth.December] = "December";

export class ThDateDO extends BaseDO {
	public static MaxMonthLength: number = 3;
	public static MaxYearLength: number = 2;
	private _isoWeekDayUtils: ISOWeekDayUtils;

    constructor() {
        super();
		this._isoWeekDayUtils = new ISOWeekDayUtils();
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
	public getISOWeekDay(): ISOWeekDay {
		var thDateUtils = new ThDateUtils();
		var thisMoment = thDateUtils.convertThDateDOToMoment(this);
		return thisMoment.isoWeekday();
	}
	
	public buildPrototype(): ThDateDO {
		return ThDateDO.buildThDateDO(this.year, this.month, this.day);
	}

	public addDays(days: number): void {
		var thDateUtils = new ThDateUtils();
		var thisMoment = thDateUtils.addDaysToThDateDO(this, days);
		this.year = thisMoment.year;
		this.month = thisMoment.month;
		this.day = thisMoment.day;
	}

	public static buildThDateDO(year: number, month: number, day: number): ThDateDO {
		var outDate = new ThDateDO();
		outDate.year = year;
		outDate.month = month;
		outDate.day = day;
		return outDate;
	}

	public toString(): string {
		if (!this.isPrintable()) {
			return "";
		}
		return this.getDayString() + "/" + this.getMonthString() + "/" + this.year;
	}
	private isPrintable() {
		return _.isNumber(this.year) && _.isNumber(this.month) && _.isNumber(this.day);
	}
	public getDayString(): string {
		return this.day < 10 ? ("0" + this.day) : ("" + this.day);
	}
	public getMonthString(): string {
		var actualMonth = this.month + 1;
		return actualMonth < 10 ? ("0" + actualMonth) : ("" + actualMonth);
	}

	public getShortDisplayString(thTranslation: ThTranslation, omitYear?: boolean): string {
		if (!this.isPrintable()) {
			return "";
		}
		var displayString = this.day + " " + this.getShortMonthDisplayString(thTranslation);
		if(!omitYear) {
			displayString += " " + this.getShortYearDisplayString();
		}
		return displayString;
	}
	
	public getLongDisplayString(thTranslation: ThTranslation): string {
		if (!this.isPrintable()) {
			return "";
		}
		return this.day + " " + thTranslation.translate(ThMonthDisplayString[this.month]) + " " + this.year;
	}

	public getLongDayDisplayString(thTranslation: ThTranslation){
		var isoDay = this.getISOWeekDay();
		var dayName = this._isoWeekDayUtils.getISOWeekDayVMList()[isoDay - 1].name;
		return thTranslation.translate(dayName);
	}

	private getShortMonthDisplayString(thTranslation: ThTranslation) {
		var monthName: string = thTranslation.translate(ThMonthDisplayString[this.month]);
		if (monthName.length > ThDateDO.MaxMonthLength) {
			monthName = monthName.substr(0, ThDateDO.MaxMonthLength);
		}
		return monthName;
	}

	private getShortYearDisplayString(): string {
		var year = this.year + "";
		if (year.length < ThDateDO.MaxYearLength) {
			return year;
		}
		return year.slice(ThDateDO.MaxYearLength);
	}
}