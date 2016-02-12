import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';

import _ = require("underscore");

export class ArrayValidationRule extends AValidationRule {
	constructor() {
		super(InvalidConstraintType.Array);
	}
	protected validateCore(object: any): boolean {
		return _.isArray(object);
	}
}