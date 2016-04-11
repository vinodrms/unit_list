import {Validator, Validators, AbstractControl} from 'angular2/common';
import {ValidationResult, AThValidator} from './validators/AThValidator';
import {EmailValidator} from './validators/EmailValidator';
import {PasswordValidator} from './validators/PasswordValidator';
import {VatValidator} from './validators/VatValidator';
import {BooleanValidator} from './validators/BooleanValidator';
import {PhoneValidator} from './validators/PhoneValidator';
import {UrlValidator} from './validators/UrlValidator';
import {PriceValidator} from './validators/PriceValidator';
import {NumberValidator} from './validators/NumberValidator';

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
    public static numberValidator(control: AbstractControl): ValidationResult {
        return ThValidators.validator(control, new NumberValidator());
    }
    public static nullableNumberValidator(control: AbstractControl): ValidationResult {
        return ThValidators.validator(control, new NumberValidator(true));
    }
	public static phoneValidator(control: AbstractControl): ValidationResult {
		return ThValidators.validator(control, new PhoneValidator());
	}
	public static nullablePhoneValidator(control: AbstractControl): ValidationResult {
		return ThValidators.validator(control, new PhoneValidator(true));
	}
	public static urlValidator(control: AbstractControl): ValidationResult {
		return ThValidators.validator(control, new UrlValidator());
	}
	public static nullableUrlValidator(control: AbstractControl): ValidationResult {
		return ThValidators.validator(control, new UrlValidator(true));
	}
	public static priceValidator(control: AbstractControl): ValidationResult {
		return ThValidators.validator(control, new PriceValidator());
	}
	public static nullablePriceValidator(control: AbstractControl): ValidationResult {
		return ThValidators.validator(control, new PriceValidator(true));
	}

	private static validator(control: AbstractControl, thValidator: AThValidator): ValidationResult {
		return thValidator.validate(control);
	}
}