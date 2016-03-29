import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {NumberValidationRule} from '../../../utils/th-validation/rules/NumberValidationRule';

export class LazyLoadRepoDO {
	pageNumber: number;
	pageSize: number;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "pageNumber",
				validationStruct: new PrimitiveValidationStructure(LazyLoadRepoDO.getPositiveIntegerNumberValidationRule())
			},
			{
				key: "pageSize",
				validationStruct: new PrimitiveValidationStructure(LazyLoadRepoDO.getPositiveIntegerNumberValidationRule())
			}
		]);
	}
	private static getPositiveIntegerNumberValidationRule(): NumberValidationRule {
		var numberRule = new NumberValidationRule();
		numberRule.minValue = 0;
		numberRule.isInteger = true;
		return numberRule;
	}
}
export interface LazyLoadMetaResponseRepoDO {
	numOfItems: number;
}