import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';

import _ = require("underscore");

export class BooleanValidationRule extends AValidationRule {
	constructor() {
		super(InvalidConstraintType.Boolean);
	}
	protected validateCore(object: any): boolean {
		return _.isBoolean(object);
	}
}