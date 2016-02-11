import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraint} from './core/ValidationResult';

import _ = require("underscore");

export class ObjectValidationRule extends AValidationRule {
	constructor() {
		super(InvalidConstraint.Object);
	}
	protected validateCore(object: any): boolean {
		return _.isObject(object);
	}
}