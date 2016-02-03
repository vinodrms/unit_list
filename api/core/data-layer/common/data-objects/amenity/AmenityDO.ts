import {BaseDO} from '../../base/BaseDO';

export class AmenityDO extends BaseDO {
	constructor() {
		super();
	}
	id: string;
	name: string;
	iconUrl: string;

	protected getPrimitiveProperties(): string[] {
		return ["id", "name", "iconUrl"];
	}
}