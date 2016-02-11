import {ValidationResult} from '../../rules/core/ValidationResult';

export interface IValidationStructure {
	validateStructure(object: any): ValidationResult;
}