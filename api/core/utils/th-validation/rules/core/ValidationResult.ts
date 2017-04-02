import {ThUtils} from '../../../../utils/ThUtils';

import _ = require('underscore');
import { IntermediateValidationResult } from "./AValidationRule";

export enum InvalidConstraintType {
	Array,
	Email,
	Number,
	Object,
	Password,
    VatNumber,
	String,
	NumberInList,
	Boolean,
	
	BedAccommodationType,
	BedStorageType
}

export class ValidationResult {
	private _invalidConstraintList: IntermediateValidationResult[];

	constructor(invalidConstraint?: IntermediateValidationResult) {
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
	public getInvalidConstraintList(): IntermediateValidationResult[] {
		return this._invalidConstraintList;
	}
	public containsInvalidConstraint(invalidConstraint: InvalidConstraintType):boolean {
		return _.contains(_.map(this._invalidConstraintList, (result: IntermediateValidationResult) => {
			return result.constraintType;
		}), invalidConstraint);
	}
}