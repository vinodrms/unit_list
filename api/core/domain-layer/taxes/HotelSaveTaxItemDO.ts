import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {NumberValidationRule} from '../../utils/th-validation/rules/NumberValidationRule';

export class HotelSaveTaxItemDO {
	type: number;
	name: string;
	valueType: number;
	value: number;
	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "type",
				validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
			},
			{
				key: "name",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(100))
			},
			{
				key: "valueType",
				validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
			},
			{
				key: "value",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
			}
		])
	}
}