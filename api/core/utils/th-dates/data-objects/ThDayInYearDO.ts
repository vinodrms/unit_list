import {BaseDO} from '../../../data-layer/common/base/BaseDO';

export class ThDayInYearDO extends BaseDO {
	constructor() {
        super();
    }
	month: number;
	day: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["month", "day"];
    }
}