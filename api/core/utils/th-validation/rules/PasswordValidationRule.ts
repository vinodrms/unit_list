import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraint} from './core/ValidationResult';
import {StringValidationRule} from './StringValidationRule';

export class PasswordValidationRule extends AValidationRule {
	private static MinLength = 6;
	private _stringValidationRule: StringValidationRule;
	constructor() {
		super(InvalidConstraint.Password);
		this._stringValidationRule = new StringValidationRule(Number.POSITIVE_INFINITY);
		this._stringValidationRule.minLength = PasswordValidationRule.MinLength;
	}
	protected validateCore(object: any): boolean {
		var stringValidationResult = this._stringValidationRule.validate(object);
		if (!stringValidationResult.isValid()) {
			return false;
		}
		return this.validateByPasswordRegex(object);
	}
	
	/*
		(?=.*[a-z]) - lower case regex
		(?=.*[A-Z]) - upper case regex
		(?=.*\d) - digit regex
		.+ - each set at least once
		$ - end of the string
	*/
	private validateByPasswordRegex(passwd: string): boolean {
		var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/i;
		return re.test(passwd);
	}
}