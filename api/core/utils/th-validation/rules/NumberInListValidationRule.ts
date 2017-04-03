import { AValidationRule, IntermediateValidationResult } from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';
import {NumberValidationRule} from './NumberValidationRule';

import _ = require("underscore");

export class NumberInListValidationRule extends AValidationRule {
    private _numberValidationRule: NumberValidationRule;

	constructor(private _validValuesList: number[]) {
		super(InvalidConstraintType.NumberInList);
		this._numberValidationRule = new NumberValidationRule();
	}
	protected validateCore(object: any, key: string): IntermediateValidationResult {
		var numberValidationResult = this._numberValidationRule.validate(object, key);
		if (!numberValidationResult.isValid()) {
			return this.buildIntermediateValidationResult(key, object, false);
		}
		return this.buildIntermediateValidationResult(key, object, _.contains(this._validValuesList, object));
	}
}