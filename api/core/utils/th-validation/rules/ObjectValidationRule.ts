import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';

import _ = require("underscore");

export class ObjectValidationRule extends AValidationRule {
	constructor() {
		super(InvalidConstraintType.Object);
	}
	protected validateCore(object: any): boolean {
		return _.isObject(object);
	}
}