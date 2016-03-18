import {AbstractControl, Validator} from 'angular2/common';

export interface ValidationResult {
	[key: string]: boolean;
}

export abstract class AThValidator implements Validator {
	private _invalidField: string;

	constructor(invalidField: string) {
		this._invalidField = invalidField;
	}

	public validate(control: AbstractControl): ValidationResult {
		if (this.isValidCore(control.value)) {
			return null;
		}
		var validationResult: ValidationResult = {};
		validationResult[this._invalidField] = true;
		return validationResult;
	}

	protected abstract isValidCore(value: any): boolean;
}