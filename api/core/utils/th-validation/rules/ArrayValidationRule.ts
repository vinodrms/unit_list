import { AValidationRule, IntermediateValidationResult } from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';

import _ = require("underscore");

export class ArrayValidationRule extends AValidationRule {
	constructor() {
		super(InvalidConstraintType.Array);
	}
	protected validateCore(object: any, key: string): IntermediateValidationResult {
		return this.buildIntermediateValidationResult(key, object, _.isArray(object));
	}
}