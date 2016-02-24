import {BaseDO} from '../../base/BaseDO';

export class AddOnProductCategoryDO extends BaseDO {
    constructor() {
		super();
	}
	id: string;
	name: string;
	iconUrl: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "name", "iconUrl"];
	}
}