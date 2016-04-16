import {AThValidator} from './AThValidator';

export class PercentageValidator extends AThValidator {
	private _minValue: number = 0;
	private _maxValue: number = 100;

	constructor(isNullable?: boolean) {
		super("invalidPercentage", isNullable);
	}

	protected isValidCore(value: any): boolean {
		if (!_.isNumber(value)) {
			return false;
		}
		return value >= this._minValue && value <= this._maxValue;
	}
}