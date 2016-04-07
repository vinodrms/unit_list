import {BaseDO} from '../../../../../../common/base/BaseDO';

export class BedTemplateDO extends BaseDO{
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