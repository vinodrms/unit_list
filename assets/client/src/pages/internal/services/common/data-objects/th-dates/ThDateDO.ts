import {BaseDO} from '../../../../../../common/base/BaseDO';

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
	
	public toString(): string {
		if(!_.isNumber(this.year) || !_.isNumber(this.month) || !_.isNumber(this.day)) {
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