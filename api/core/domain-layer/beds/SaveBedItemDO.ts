import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {NumberValidationRule} from '../../utils/th-validation/rules/NumberValidationRule';
import {BedSizeDO} from '../../data-layer/common/data-objects/bed/BedDO';

export class SaveBedItemDO {
	name: string;
	maxNoAdults: number;
	maxNoChildren: number;
	status: number;
    size: BedSizeDO;
    
	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
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
				key: "status",
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
			}
		])
	}
}