import {BaseDO} from '../../base/BaseDO';

export enum AddOnProductCategoryType {
	Breakfast,
	AddOnProduct
}

export class AddOnProductCategoryDO extends BaseDO {
    constructor() {
		super();
	}
	id: string;
	type: AddOnProductCategoryType;
	name: string;
	iconUrl: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "type", "name", "iconUrl"];
	}
}