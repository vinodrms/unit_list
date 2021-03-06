import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {NumberValidationRule} from '../../utils/th-validation/rules/NumberValidationRule';

export class SaveAddOnProductItemDO {
	categoryId: string;
	name: string;
	price: number;
	internalCost: number;
	taxIdList: string[];
	notes: string;
	fileUrlList: string[];

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "id",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
			},
			{
				key: "categoryId",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
			{
				key: "name",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(100))
			},
			{
				key: "price",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
			},
			{
				key: "internalCost",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildNullablePriceNumberRule())
			},
			{
				key: "taxIdList",
				validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
			},
			{
				key: "notes",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
			},
            {
                key: "fileUrlList",
                validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxUrlLength)))
            }
		])
	}
}