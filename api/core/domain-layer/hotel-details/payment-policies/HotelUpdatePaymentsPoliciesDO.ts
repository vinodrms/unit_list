import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { ArrayValidationStructure } from '../../../utils/th-validation/structure/ArrayValidationStructure';
import { StringValidationRule } from '../../../utils/th-validation/rules/StringValidationRule';
import { NumberValidationRule } from '../../../utils/th-validation/rules/NumberValidationRule';

export class HotelUpdatePaymentsPoliciesDO {
	ccyCode: string;
	paymentMethodIdList: string[];
	additionalInvoiceDetails: string;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "ccyCode",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxCurrencyCodeLength))
			},
			{
				key: "paymentMethodIdList",
				validationStruct: new ArrayValidationStructure(
					new PrimitiveValidationStructure(new StringValidationRule())
				)
			},
			{
				key: "additionalInvoiceDetails",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(2000))
			},
		]);
	}
}