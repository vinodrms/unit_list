import {BaseDO} from '../../common/base/BaseDO';

import _ = require('underscore');

export class AddOnProductSnapshotDO extends BaseDO {
    id: string;
    categoryId: string;
    name: string;
    price: number;
    internalCost: number;
    taxIdList: string[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "categoryId", "name", "price", "internalCost", "taxIdList"];
    }

    public getVatId(): string {
		if (!_.isEmpty(this.taxIdList)) {
			return this.taxIdList[0];
		}
		return null;
	}
}