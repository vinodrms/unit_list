import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {NumberInListValidationRule} from '../../../utils/th-validation/rules/NumberInListValidationRule';
import {BookingValidationStructures} from '../../bookings/validators/BookingValidationStructures';

export enum PriceProductYieldAttribute {
	OpenPeriod,
	OpenForArrivalPeriod,
	OpenForDeparturePeriod
}

export class PriceProductYieldingDO {
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
				validationStruct: BookingValidationStructures.getThDateIntervalDOValidationStructure()
			},
			{
				key: "attribute",
				validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([PriceProductYieldAttribute.OpenPeriod, PriceProductYieldAttribute.OpenForArrivalPeriod, PriceProductYieldAttribute.OpenForDeparturePeriod]))
			}
		]);
	}
}