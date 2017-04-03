import { AValidationRule, IntermediateValidationResult } from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';
import {StringValidationRule} from './StringValidationRule';

export class PasswordValidationRule extends AValidationRule {
	private _stringValidationRule: StringValidationRule;
	private static MinLength = 6;
	private static PasswordRegexList: RegExp[] = [
		/^(?=.*[a-z]).+$/,
		/^(?=.*[A-Z]).+$/,
		/^(?=.*\d).+$/
	]
	
	constructor() {
		super(InvalidConstraintType.Password);
		this._stringValidationRule = new StringValidationRule();
	}
	protected validateCore(object: any, key: string): IntermediateValidationResult {
		var stringValidationResult = this._stringValidationRule.validate(object, key);
		if (!stringValidationResult.isValid()) {
			return this.buildIntermediateValidationResult(key, object, false);
		}
		return this.buildIntermediateValidationResult(key, object, this.validateByPasswordRegex(object));
	}
	private validateByPasswordRegex(passwd: string): boolean {
		var valueStr: string = passwd;
		if (valueStr.length < PasswordValidationRule.MinLength) {
			return false;
		}
		for (var index = 0; index < PasswordValidationRule.PasswordRegexList.length; index++) {
			var regex = PasswordValidationRule.PasswordRegexList[index];
			if (!regex.test(valueStr)) {
				return false;
			}
		}
		return true;
	}
}