import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {EmailValidationRule} from '../../../utils/th-validation/rules/EmailValidationRule';
import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';

export class UserAccountActivationDO {
	activationCode: string;
	email: string;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "activationCode",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
			{
				key: "email",
				validationStruct: new PrimitiveValidationStructure(new EmailValidationRule())
			}
		]);
	}
}