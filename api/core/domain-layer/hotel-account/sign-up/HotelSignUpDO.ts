import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {EmailValidationRule} from '../../../utils/th-validation/rules/EmailValidationRule';
import {PasswordValidationRule} from '../../../utils/th-validation/rules/PasswordValidationRule';

export class HotelSignUpDO {
	hotelName: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;

	public static getValidationRules(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "hotelName",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxHotelNameLength))
			},
			{
				key: "email",
				validationStruct: new PrimitiveValidationStructure(new EmailValidationRule())
			},
			{
				key: "password",
				validationStruct: new PrimitiveValidationStructure(new PasswordValidationRule())

			},
			{
				key: "firstName",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxNameLength))
			},
			{
				key: "lastName",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxNameLength))
			}
		]);
	}
}