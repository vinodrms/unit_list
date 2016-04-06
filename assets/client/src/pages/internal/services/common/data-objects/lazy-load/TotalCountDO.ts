import {BaseDO} from '../../../../../../common/base/BaseDO';

export class TotalCountDO extends BaseDO {
	numOfItems: number;

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["numOfItems"];
    }

	public getLastPageIndex(numOfItemsPerPage: number): number {
		var pageIndex = Math.ceil(this.numOfItems / numOfItemsPerPage);
		if (pageIndex > 0) {
			pageIndex--;
		}
		return pageIndex;
	}
}