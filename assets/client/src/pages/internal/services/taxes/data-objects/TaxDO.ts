import {BaseDO} from '../../../../../common/base/BaseDO';

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
	type: TaxType;
	name: string;
	valueType: TaxValueType;
	value: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "type", "name", "valueType", "value"];
	}
	
	public isFixedValue(): boolean {
		return this.valueType === TaxValueType.Fixed;
	}
	public isPercentageValue(): boolean {
		return this.valueType === TaxValueType.Percentage;
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
}