import { IValidationStructure } from '../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import { ArrayValidationStructure } from '../../utils/th-validation/structure/ArrayValidationStructure';
import { StringValidationRule } from '../../utils/th-validation/rules/StringValidationRule';
import { NumberValidationRule } from '../../utils/th-validation/rules/NumberValidationRule';
import { NumberInListValidationRule } from '../../utils/th-validation/rules/NumberInListValidationRule';
import { BedSizeDO, BedCapacityDO, BedAccommodationType, BedStorageType } from '../../data-layer/common/data-objects/bed/BedDO';

export class SaveBedItemDO {
	bedTemplateId: string;
	name: string;
	capacity: BedCapacityDO;
	status: number;
	storageType: number;
	accommodationType: number;
	size: BedSizeDO;
	notes: string;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "bedTemplateId",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
			{
				key: "storageType",
				validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([BedStorageType.Rollaway, BedStorageType.Stationary]))
			},
			{
				key: "accommodationType",
				validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([BedAccommodationType.Any, BedAccommodationType.Babies]))
			},
			{
				key: "name",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(100))
			},
			{
				key: "notes",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
			}
		]);
	}
	public static getSizeAndCapacityValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
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
				key: "capacity",
				validationStruct: new ObjectValidationStructure([
					{
						key: "maxNoAdults",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule())
					},
					{
						key: "maxNoChildren",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule())
					},
					{
						key: "maxNoBabies",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule())
					}
				])
			}
		]);
	}
}