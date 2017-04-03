import { AValidationRule, IntermediateValidationResult } from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';
import {StringValidationRule} from './StringValidationRule';

export class VatNumberValidationRule extends AValidationRule {
    private _stringValidationRule: StringValidationRule;
	constructor() {
		super(InvalidConstraintType.VatNumber);
		this._stringValidationRule = new StringValidationRule(25);
	}
	protected validateCore(object: any, key: string): IntermediateValidationResult {
		var stringValidationResult = this._stringValidationRule.validate(object, key);
		if (!stringValidationResult.isValid()) {
			return this.buildIntermediateValidationResult(key, object, false);
		}

        return this.buildIntermediateValidationResult(key, object, this.validateByVatNumberRegex(object));
	}
	private validateByVatNumberRegex(vatNumber: string): boolean {
		var re = /^[0-9\-]*$/;
		return re.test(vatNumber);
	}
}