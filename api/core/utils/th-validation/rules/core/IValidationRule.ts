import {ValidationResult} from './ValidationResult';

export interface IValidationRule {
	validate(object: any): ValidationResult;
}