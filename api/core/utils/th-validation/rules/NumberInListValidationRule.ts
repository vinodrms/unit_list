import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';
import {NumberValidationRule} from './NumberValidationRule';

import _ = require("underscore");

export class NumberInListValidationRule extends AValidationRule {
    private _numberValidationRule: NumberValidationRule;

	constructor(private _validValuesList: number[]) {
		super(InvalidConstraintType.NumberInList);
		this._numberValidationRule = new NumberValidationRule();
	}
	protected validateCore(object: any): boolean {
		var numberValidationResult = this._numberValidationRule.validate(object);
		if (!numberValidationResult.isValid()) {
			return false;
		}
		return _.contains(this._validValuesList, object);
	}
}