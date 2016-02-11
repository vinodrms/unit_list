import {AValidationStructure} from './core/AValidationStructure';
import {ValidationResult} from '../rules/core/ValidationResult';
import {IValidationRule} from '../rules/core/IValidationRule';

export class PrimitiveValidationStructure extends AValidationStructure {
	constructor(validationRules: IValidationRule) {
		super(validationRules);
	}
	protected validateStructureCore(object: any): ValidationResult {
		return new ValidationResult();
	}
}