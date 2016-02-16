import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {NumberValidationRule} from '../../../utils/th-validation/rules/NumberValidationRule';

export interface HotelAddPaymentsPoliciesVatDO {
	name: string;
	value: number;
}
export interface HotelAddPaymentsPoliciesOtherTaxDO {
	type: number;
	name: string;
	value: number;
}

export class HotelAddPaymentsPoliciesDO {
	ccyCode: string;
	paymentMethodIdList: string[];
	taxes: {
		vatList: HotelAddPaymentsPoliciesVatDO[],
		otherTaxList: HotelAddPaymentsPoliciesOtherTaxDO[]
	}

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
				key: "taxes",
				validationStruct: new ObjectValidationStructure([
					{
						key: "vatList",
						validationStruct: new ArrayValidationStructure(
							new ObjectValidationStructure([
								{
									key: "name",
									validationStruct: new PrimitiveValidationStructure(new StringValidationRule(100))
								},
								{
									key: "value",
									validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPercentageNumberRule())
								}
							])
						)
					},
					{
						key: "otherTaxList",
						validationStruct: new ArrayValidationStructure(
							new ObjectValidationStructure([
								{
									key: "type",
									validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
								},
								{
									key: "name",
									validationStruct: new PrimitiveValidationStructure(new StringValidationRule(100))
								},
								{
									key: "value",
									validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
								}
							])
						)
					}
				])
			}
		]);
	}
}