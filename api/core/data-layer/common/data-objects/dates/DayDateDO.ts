import {BaseDO} from '../../base/BaseDO';

import moment = require("moment");

export class DayDateDO extends BaseDO {
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
		var momentDate = moment([this.year, this.month, this.day]);
		return momentDate.isValid();
	}
}