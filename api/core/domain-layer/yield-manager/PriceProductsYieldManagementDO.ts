import {ThDateIntervalDO} from '../../utils/th-dates/data-objects/ThDateIntervalDO';
import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {NumberValidationRule} from '../../utils/th-validation/rules/NumberValidationRule';
import {NumberInListValidationRule} from '../../utils/th-validation/rules/NumberInListValidationRule';

export enum PriceProductYieldAttribute {
	OpenPeriod,
	OpenForArrivalPeriod,
	OpenForDeparturePeriod
}

export class PriceProductsYieldManagementDO {
	priceProductIdList: string[];
	interval: ThDateIntervalDO;
	attribute: PriceProductYieldAttribute;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "priceProductIdList",
				validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
			},
			{
				key: "interval",
				validationStruct: new ObjectValidationStructure([
					{
						key: "start",
						validationStruct: PriceProductsYieldManagementDO.getThDateDOValidationStructure()
					},
					{
						key: "end",
						validationStruct: PriceProductsYieldManagementDO.getThDateDOValidationStructure()
					}
				])
			},
			{
				key: "attribute",
				validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([PriceProductYieldAttribute.OpenPeriod, PriceProductYieldAttribute.OpenForArrivalPeriod, PriceProductYieldAttribute.OpenForDeparturePeriod]))
			}
		]);
	}
	private static getThDateDOValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "year",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
			},
			{
				key: "month",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
			},
			{
				key: "day",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(1))
			}
		]);
	}
}