import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';
import {StringValidationRule} from './StringValidationRule';

export class VatNumberValidationRule extends AValidationRule {
    private _stringValidationRule: StringValidationRule;
	constructor() {
		super(InvalidConstraintType.VatNumber);
		this._stringValidationRule = new StringValidationRule(25);
	}
	protected validateCore(object: any): boolean {
		var stringValidationResult = this._stringValidationRule.validate(object);
		if (!stringValidationResult.isValid()) {
			return false;
		}
        
        var result: boolean = this.validateByVatNumberRegex(object);
        
		return result;
	}
	private validateByVatNumberRegex(vatNumber: string): boolean {
		var re = /^[0-9\-]*$/;
		return re.test(vatNumber);
	}
}