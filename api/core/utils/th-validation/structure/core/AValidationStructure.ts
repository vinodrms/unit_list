import {IValidationStructure} from './IValidationStructure';
import {IValidationRule} from '../../rules/core/IValidationRule';
import {ValidationResult} from '../../rules/core/ValidationResult';

export abstract class AValidationStructure implements IValidationStructure {
	constructor(protected _validationRule: IValidationRule) {
	}
	public validateStructure(object: any): ValidationResult {
		var validationResult = this._validationRule.validate(object);
		if (!validationResult.isValid()) {
			return validationResult;
		}
		return this.validateStructureCore(object);
	}
	protected abstract validateStructureCore(object: any): ValidationResult;
}