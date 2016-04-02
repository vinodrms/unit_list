import {BaseDO} from '../../../../../../common/base/BaseDO';

export class TotalCountDO extends BaseDO {
	numOfItems: number;

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["numOfItems"];
    }
}