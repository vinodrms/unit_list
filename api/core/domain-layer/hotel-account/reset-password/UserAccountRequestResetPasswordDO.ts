import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {EmailValidationRule} from '../../../utils/th-validation/rules/EmailValidationRule';

export class UserAccountRequestResetPasswordDO {
	email: string;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "email",
				validationStruct: new PrimitiveValidationStructure(new EmailValidationRule())
			}
		]);
	}
}