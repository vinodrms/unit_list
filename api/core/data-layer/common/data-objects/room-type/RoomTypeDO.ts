import {BaseDO} from '../../base/BaseDO';

export class RoomTypeDO extends BaseDO {
	constructor() {
		super();
	}
	id: string;
	name: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "name"];
	}
}