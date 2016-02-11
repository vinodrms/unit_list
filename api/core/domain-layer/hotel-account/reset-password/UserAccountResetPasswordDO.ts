import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {EmailValidationRule} from '../../../utils/th-validation/rules/EmailValidationRule';
import {PasswordValidationRule} from '../../../utils/th-validation/rules/PasswordValidationRule';

export class UserAccountResetPasswordDO {
	activationCode: string;
	email: string;
	password: string;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "activationCode",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
			{
				key: "email",
				validationStruct: new PrimitiveValidationStructure(new EmailValidationRule())
			},
			{
				key: "password",
				validationStruct: new PrimitiveValidationStructure(new PasswordValidationRule())

			}
		]);
	}
}