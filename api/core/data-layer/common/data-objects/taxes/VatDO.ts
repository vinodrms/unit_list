import {BaseDO} from '../../base/BaseDO';

export class VatDO extends BaseDO {
	constructor() {
		super();
	}
	id: string;
	name: string;
	value: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "name", "value"];
	}
}