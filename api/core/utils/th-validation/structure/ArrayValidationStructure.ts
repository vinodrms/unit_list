import {AValidationStructure} from './core/AValidationStructure';
import {IValidationStructure} from './core/IValidationStructure';
import {ArrayValidationRule} from '../rules/ArrayValidationRule';
import {ValidationResult} from '../rules/core/ValidationResult';

export class ArrayValidationStructure extends AValidationStructure {
	constructor(private _itemValidationStructure: IValidationStructure) {
		super(new ArrayValidationRule());
	}
	protected validateStructureCore(object: any, key?: string): ValidationResult {
		var objectArray: any[] = object;
		var validationResult: ValidationResult = new ValidationResult();
		for(let i = 0; i < objectArray.length; ++i) {
			var objectValidationResult = this._itemValidationStructure.validateStructure(objectArray[i], this.getKey(key, i));
			validationResult.appendValidationResult(objectValidationResult);
		}
		return validationResult;
	}

	private getKey(key: string, index: number): string {
		return key + "[" + index + "]";
	}
}