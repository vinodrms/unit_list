import { AValidationRule, IntermediateValidationResult } from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';

import _ = require("underscore");

export class ObjectValidationRule extends AValidationRule {
	constructor() {
		super(InvalidConstraintType.Object);
	}
	protected validateCore(object: any, key: string): IntermediateValidationResult {
		return this.buildIntermediateValidationResult(key, object, _.isObject(object));
	}
}