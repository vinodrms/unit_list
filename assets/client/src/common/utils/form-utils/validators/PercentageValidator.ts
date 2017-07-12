import { AThValidator } from './AThValidator';
import { ThDataValidators } from '../utils/ThDataValidators';

import * as _ from "underscore";

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
		return ThDataValidators.isValidPercentage(value, this._minValue, this._maxValue);
	}
}