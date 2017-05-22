import { BaseDO } from '../../common/base/BaseDO';
import _ = require("underscore");

export enum TaxType {
	Vat,
	OtherTax
}
export enum TaxStatus {
	Active,
	Deleted
}
export enum TaxValueType {
	Percentage,
	Fixed
}

export class TaxDO extends BaseDO {
	constructor() {
		super();
	}
	id: string;
	hotelId: string;
	versionId: number;
	type: TaxType;
	status: TaxStatus;
	name: string;
	valueType: TaxValueType;
	value: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "hotelId", "versionId", "type", "status", "name", "valueType", "value"];
	}

	public isValid(): boolean {
		switch (this.type) {
			case TaxType.Vat:
				if (this.valueType !== TaxValueType.Percentage) {
					return false;
				}
				break;
			default:
				break;
		}
		switch (this.valueType) {
			case TaxValueType.Percentage:
				return _.isNumber(this.value) && this.value >= 0 && this.value <= 1;
			case TaxValueType.Fixed:
				return _.isNumber(this.value) && this.value >= 0;
			default:
				return false;
		}
	}

	public getNetValue(price: number): number {
		switch (this.valueType) {
			case TaxValueType.Percentage:
				return price / (1 + this.value);
			case TaxValueType.Fixed:
				return price - this.value;
			default:
				return price;
		}
	}
}