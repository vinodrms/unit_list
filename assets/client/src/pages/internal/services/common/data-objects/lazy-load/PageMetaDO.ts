import {BaseDO} from '../../../../../../common/base/BaseDO';

export class PageMetaDO extends BaseDO {
	pageNumber: number;
	pageSize: number;

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["pageNumber", "pageSize"];
    }
}