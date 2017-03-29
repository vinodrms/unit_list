import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { ArrayValidationStructure } from '../../../utils/th-validation/structure/ArrayValidationStructure';
import { StringValidationRule } from '../../../utils/th-validation/rules/StringValidationRule';
import { NumberValidationRule } from '../../../utils/th-validation/rules/NumberValidationRule';
import { PaymentMethodInstanceDO } from "../../../data-layer/common/data-objects/payment-method/PaymentMethodInstanceDO";

export class HotelUpdatePaymentsPoliciesDO {
	ccyCode: string;
	paymentMethodList: PaymentMethodInstanceDO[];
	additionalInvoiceDetails: string;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "ccyCode",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxCurrencyCodeLength))
			},
			{
				key: "paymentMethodList",
				validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
					{
						key: "paymentMethodId",
						validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
					},
					{
						key: "transactionFee",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildNullable())
					}
				]))
			},
			{
				key: "additionalInvoiceDetails",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(2000))
			},
		]);
	}
}