import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {NumberValidationRule} from '../../utils/th-validation/rules/NumberValidationRule';
import {BedSizeDO} from '../../data-layer/common/data-objects/bed/BedDO';

export class SaveBedItemDO {
	bedTemplateId: string;
    name: string;
	maxNoAdults: number;
	maxNoChildren: number;
	status: number;
    size: BedSizeDO;
	notes: string;
    
	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "bedTemplateId",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
            {
				key: "name",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(100))
			},
			{
				key: "maxNoAdults",
				validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
			},
			{
				key: "maxNoChildren",
				validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
			},
            {
				key: "size",
				validationStruct: new ObjectValidationStructure([
					{
						key: "widthCm",
						validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
					},
					{
						key: "lengthCm",
						validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
					}
				])
			},
            {
				key: "notes",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
			}
		])
	}
}