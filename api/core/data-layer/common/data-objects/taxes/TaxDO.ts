import {BaseDO} from '../../base/BaseDO';

export enum TaxType {
	Percentage,
	Fixed
}

export class TaxDO extends BaseDO {
	constructor() {
		super();
	}
	id: string;
	type: TaxType;
	name: string;
	value: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "type", "name", "value"];
	}
}