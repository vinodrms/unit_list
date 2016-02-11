import {ThUtils} from '../../../../utils/ThUtils';

import _ = require('underscore');

export enum InvalidConstraint {
	Array,
	Email,
	Number,
	Object,
	Password,
	String
}

export class ValidationResult {
	private _invalidConstraints: InvalidConstraint[];

	constructor(invalidConstraint?: InvalidConstraint) {
		this._invalidConstraints = [];
		var thUtils = new ThUtils();
		if (!thUtils.isUndefinedOrNull(invalidConstraint)) {
			this._invalidConstraints.push(invalidConstraint);
		}
	}
	public isValid(): boolean {
		return this._invalidConstraints.length == 0;
	}
	public appendValidationResult(otherResult: ValidationResult) {
		this._invalidConstraints = this._invalidConstraints.concat(otherResult.getInvalidConstraints());
	}
	public getInvalidConstraints(): InvalidConstraint[] {
		return this._invalidConstraints;
	}
	public containsInvalidConstraint(invalidConstraint: InvalidConstraint) {
		return _.contains(this._invalidConstraints, invalidConstraint);
	}
}