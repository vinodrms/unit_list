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
		if(!control.value && this._isNullable) {
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
}