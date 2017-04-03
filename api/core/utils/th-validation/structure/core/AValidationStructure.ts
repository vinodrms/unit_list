import {IValidationStructure} from './IValidationStructure';
import {IValidationRule} from '../../rules/core/IValidationRule';
import {ValidationResult} from '../../rules/core/ValidationResult';

export abstract class AValidationStructure implements IValidationStructure {
	constructor(protected _validationRule: IValidationRule) {
	}
	public validateStructure(object: any, key?: string): ValidationResult {
		var validationResult = this._validationRule.validate(object, key);
		if (!validationResult.isValid()) {
			return validationResult;
		}
		return this.validateStructureCore(object, key);
	}
	protected abstract validateStructureCore(object: any, key?: string): ValidationResult;
}