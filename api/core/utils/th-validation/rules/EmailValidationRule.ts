import { AValidationRule, IntermediateValidationResult } from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';
import {StringValidationRule} from './StringValidationRule';

export class EmailValidationRule extends AValidationRule {
	private static MaxEmailLength = 320;
	private _stringValidationRule: StringValidationRule;
	constructor() {
		super(InvalidConstraintType.Email);
		this._stringValidationRule = new StringValidationRule(EmailValidationRule.MaxEmailLength);
	}
	protected validateCore(object: any, key: string): IntermediateValidationResult {
		var stringValidationResult = this._stringValidationRule.validate(object, key);
		if (!stringValidationResult.isValid()) {
			return this.buildIntermediateValidationResult(key, object, false);
		}
		return this.buildIntermediateValidationResult(key, object, this.validateByEmailRegex(object));
	}

	private validateByEmailRegex(email: string): boolean {
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return re.test(email);
	}
	public static buildNullable(): EmailValidationRule {
		var rule = new EmailValidationRule();
		rule.isNullable = true;
		return rule;
	}
}