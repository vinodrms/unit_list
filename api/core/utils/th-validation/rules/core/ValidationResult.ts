import {ThUtils} from '../../../../utils/ThUtils';

import _ = require('underscore');

export enum InvalidConstraintType {
	Array,
	Email,
	Number,
	Object,
	Password,
	String
}

export class ValidationResult {
	private _invalidConstraintList: InvalidConstraintType[];

	constructor(invalidConstraint?: InvalidConstraintType) {
		this._invalidConstraintList = [];
		var thUtils = new ThUtils();
		if (!thUtils.isUndefinedOrNull(invalidConstraint)) {
			this._invalidConstraintList.push(invalidConstraint);
		}
	}
	public isValid(): boolean {
		return this._invalidConstraintList.length == 0;
	}
	public appendValidationResult(otherResult: ValidationResult) {
		this._invalidConstraintList = this._invalidConstraintList.concat(otherResult.getInvalidConstraintList());
	}
	public getInvalidConstraintList(): InvalidConstraintType[] {
		return this._invalidConstraintList;
	}
	public containsInvalidConstraint(invalidConstraint: InvalidConstraintType) {
		return _.contains(this._invalidConstraintList, invalidConstraint);
	}
}