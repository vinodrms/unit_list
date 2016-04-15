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
}