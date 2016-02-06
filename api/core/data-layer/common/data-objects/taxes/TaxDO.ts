import {BaseDO} from '../../base/BaseDO';

export enum TaxType {
	Percentage,
	Value
}

export class TaxDO extends BaseDO {
	constructor() {
		super();
	}
	id: string;
	name: string;
	type: TaxType;
	value: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "name", "type", "value"];
	}
}