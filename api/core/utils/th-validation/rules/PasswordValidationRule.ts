import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraint} from './core/ValidationResult';
import {StringValidationRule} from './StringValidationRule';

export class PasswordValidationRule extends AValidationRule {
	private _stringValidationRule: StringValidationRule;
	constructor() {
		super(InvalidConstraint.Password);
		this._stringValidationRule = new StringValidationRule();
	}
	protected validateCore(object: any): boolean {
		var stringValidationResult = this._stringValidationRule.validate(object);
		if (!stringValidationResult.isValid()) {
			return false;
		}
		return this.validateByPasswordRegex(object);
	}
	private validateByPasswordRegex(passwd: string): boolean {
		var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
		return re.test(passwd);
	}
}