import {AbstractControl, Validator} from 'angular2/common';

export interface ValidationResult {
	[key: string]: boolean;
}

export abstract class AThValidator implements Validator {
	private _invalidField: string;
	private _isNullable: boolean = false;

	constructor(invalidField: string, isNullable?: boolean) {
		this._invalidField = invalidField;
		if (isNullable) {
			this._isNullable = true;
		}
	}

	public validate(control: AbstractControl): ValidationResult {
		if (this._isNullable && (control.value == null || control.value == undefined || this.isEmptyString(control.value))) {
			return null;
		}
		if (this.isValidCore(control.value)) {
			return null;
		}
		var validationResult: ValidationResult = {};
		validationResult[this._invalidField] = true;
		return validationResult;
	}

	protected abstract isValidCore(value: any): boolean;

	private isEmptyString(value: any): boolean {
		if (_.isString(value)) {
			var valueStr = <string>value;
			return valueStr.length == 0;
		}
		return false;
	}
}