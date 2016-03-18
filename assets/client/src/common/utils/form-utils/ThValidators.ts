import {Validator, Validators, AbstractControl} from 'angular2/common';
import {ValidationResult, AThValidator} from './validators/AThValidator';
import {EmailValidator} from './validators/EmailValidator';
import {PasswordValidator} from './validators/PasswordValidator';
import {VatValidator} from './validators/VatValidator';
import {BooleanValidator} from './validators/BooleanValidator';

export class ThValidators {
	public static emailValidator(control: AbstractControl): ValidationResult {
		return ThValidators.validator(control, new EmailValidator());
	}
	public static passwordValidator(control: AbstractControl): ValidationResult {
		return ThValidators.validator(control, new PasswordValidator());
	}
	public static vatValidator(control: AbstractControl): ValidationResult {
		return ThValidators.validator(control, new VatValidator());
	}
	public static booleanValidator(control: AbstractControl): ValidationResult {
		return ThValidators.validator(control, new BooleanValidator());
	}

	private static validator(control: AbstractControl, thValidator: AThValidator): ValidationResult {
		return thValidator.validate(control);
	}
}