import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { ArrayValidationStructure } from '../../../utils/th-validation/structure/ArrayValidationStructure';
import { StringValidationRule } from '../../../utils/th-validation/rules/StringValidationRule';
import { NumberInListValidationRule } from '../../../utils/th-validation/rules/NumberInListValidationRule';
import { BooleanValidationRule } from '../../../utils/th-validation/rules/BooleanValidationRule';
import { CommonValidationStructures } from "../../common/CommonValidations";

export enum PriceProductYieldAction {
	Open,
	Close,
	OpenForArrival,
	CloseForArrival,
	OpenForDeparture,
	CloseForDeparture
}

export class PriceProductYieldingDO {
	priceProductIdList: string[];
	action: PriceProductYieldAction;
	forever: boolean;
	interval: ThDateIntervalDO;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "priceProductIdList",
				validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
			},
			{
				key: "action",
				validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([
					PriceProductYieldAction.Open, PriceProductYieldAction.Close,
					PriceProductYieldAction.OpenForArrival, PriceProductYieldAction.CloseForArrival,
					PriceProductYieldAction.OpenForDeparture, PriceProductYieldAction.CloseForDeparture]))
			},
			{
				key: "forever",
				validationStruct: new PrimitiveValidationStructure(new BooleanValidationRule())
			}
		]);
	}

	public static getIntervalValidationStructure(): IValidationStructure {
		return CommonValidationStructures.getThDateIntervalDOValidationStructure();
	}
}