import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraint} from './core/ValidationResult';

import _ = require("underscore");

export class ArrayValidationRule extends AValidationRule {
	constructor() {
		super(InvalidConstraint.Array);
	}
	protected validateCore(object: any): boolean {
		return _.isArray(object);
	}
}