import {BaseDO} from '../../base/BaseDO';

export enum TaxType {
	Percentage,
	Fixed
}

import _ = require("underscore");

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

	public isValid(): boolean {
		switch (this.type) {
			case TaxType.Percentage:
				return _.isNumber(this.value) && this.value >= 0 && this.value <= 1;
			case TaxType.Fixed:
				return _.isNumber(this.value) && this.value >= 0;
			default:
				return false;
		}
	}
}