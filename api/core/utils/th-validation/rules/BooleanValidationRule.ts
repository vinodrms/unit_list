import { AValidationRule, IntermediateValidationResult } from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';

import _ = require("underscore");

export class BooleanValidationRule extends AValidationRule {
	constructor() {
		super(InvalidConstraintType.Boolean);
	}
	protected validateCore(object: any, key: string): IntermediateValidationResult {
		return this.buildIntermediateValidationResult(key, object, _.isBoolean(object));
	}
}