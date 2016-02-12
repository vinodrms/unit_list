import {AValidationStructure} from './core/AValidationStructure';
import {IValidationStructure} from './core/IValidationStructure';
import {ArrayValidationRule} from '../rules/ArrayValidationRule';
import {ValidationResult} from '../rules/core/ValidationResult';

export class ArrayValidationStructure extends AValidationStructure {
	constructor(private _itemValidationStructure: IValidationStructure) {
		super(new ArrayValidationRule());
	}
	protected validateStructureCore(object: any): ValidationResult {
		var objectArray: any[] = object;
		var validationResult: ValidationResult = new ValidationResult();
		objectArray.forEach((object: any) => {
			var objectValidationResult = this._itemValidationStructure.validateStructure(object);
			validationResult.appendValidationResult(objectValidationResult);
		});
		return validationResult;
	}
}