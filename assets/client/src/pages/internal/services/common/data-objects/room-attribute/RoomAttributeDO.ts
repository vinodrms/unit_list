import {BaseDO} from '../../../../../../common/base/BaseDO';

export class RoomAttributeDO extends BaseDO {
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