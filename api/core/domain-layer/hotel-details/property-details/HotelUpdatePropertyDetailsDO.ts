import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {ArrayValidationStructure} from '../../../utils/th-validation/structure/ArrayValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {EmailValidationRule} from '../../../utils/th-validation/rules/EmailValidationRule';
import {NumberValidationRule} from '../../../utils/th-validation/rules/NumberValidationRule';

export interface HotelUpdatePropertyDetailsHourDO {
	hour: number;
	minute: number;
}

export class HotelUpdatePropertyDetailsDO {
	operationHours: {
		checkInFrom: HotelUpdatePropertyDetailsHourDO,
		checkInToOptional: HotelUpdatePropertyDetailsHourDO,
		checkOutFromOptional: HotelUpdatePropertyDetailsHourDO,
		checkOutTo: HotelUpdatePropertyDetailsHourDO,
		cancellationHour: HotelUpdatePropertyDetailsHourDO
	}
	timezone: string;
	amenityIdList: string[];

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "operationHours",
				validationStruct: new ObjectValidationStructure([
					{
						key: "checkInFrom",
						validationStruct: HotelUpdatePropertyDetailsDO.getRequiredHourDOValidationStructure()
					},
					{
						key: "checkInToOptional",
						validationStruct: HotelUpdatePropertyDetailsDO.getOptionalHourDOValidationStructure()
					},
					{
						key: "checkOutFromOptional",
						validationStruct: HotelUpdatePropertyDetailsDO.getOptionalHourDOValidationStructure()
					},
					{
						key: "checkOutTo",
						validationStruct: HotelUpdatePropertyDetailsDO.getRequiredHourDOValidationStructure()
					},
					{
						key: "cancellationHour",
						validationStruct: HotelUpdatePropertyDetailsDO.getRequiredHourDOValidationStructure()
					}
				])
			},
			{
				key: "timezone",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
			{
				key: "amenityIdList",
				validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
			}
		]);
	}

	private static getRequiredHourDOValidationStructure(): ObjectValidationStructure {
		return HotelUpdatePropertyDetailsDO.getHourDOValidationStructure(false);
	}
	private static getOptionalHourDOValidationStructure(): ObjectValidationStructure {
		return HotelUpdatePropertyDetailsDO.getHourDOValidationStructure(true);
	}
	private static getHourDOValidationStructure(isNullable: boolean) {
		return new ObjectValidationStructure([
			{
				key: "hour",
				validationStruct: new PrimitiveValidationStructure(HotelUpdatePropertyDetailsDO.getNumberValidationRule(isNullable))
			},
			{
				key: "minute",
				validationStruct: new PrimitiveValidationStructure(HotelUpdatePropertyDetailsDO.getNumberValidationRule(isNullable))
			}
		]);
	}
	private static getNumberValidationRule(isNullable: boolean): NumberValidationRule {
		var rule = new NumberValidationRule();
		rule.isNullable = isNullable;
		return rule;
	}
}