import {AValidationStructure} from './core/AValidationStructure';
import {IValidationStructure} from './core/IValidationStructure';
import {ObjectValidationRule} from '../rules/ObjectValidationRule';
import {ValidationResult} from '../rules/core/ValidationResult';

export class ObjectValidationStructure extends AValidationStructure {
	constructor(private _structure: { key: string, validationStruct: IValidationStructure }[], private _optionalStructure?:  { key: string, validationStruct: IValidationStructure }[]) {
		super(new ObjectValidationRule);
	}
	protected validateStructureCore(object: any): ValidationResult {
		var validationResult = new ValidationResult();
		this._structure.forEach(((childStructure: { key: string, validationStruct: IValidationStructure }) => {
			var childStructureResult = childStructure.validationStruct.validateStructure(object[childStructure.key], childStructure.key);
			validationResult.appendValidationResult(childStructureResult);
		}));
		if (this._optionalStructure) {
			this._optionalStructure.forEach(((childStructure: { key: string, validationStruct: IValidationStructure }) => {
				if (object[childStructure.key]) {
					var childStructureResult = childStructure.validationStruct.validateStructure(object[childStructure.key], childStructure.key);
					validationResult.appendValidationResult(childStructureResult);
				}
			}));
		}
		return validationResult;
	}
}