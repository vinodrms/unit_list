import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {EmailValidationRule} from '../../../utils/th-validation/rules/EmailValidationRule';
import {NumberValidationRule} from '../../../utils/th-validation/rules/NumberValidationRule';

export class HotelUpdateBasicInfoDO {
	versionId: number;
	contactDetails: {
		vatCode: string,
		name: string,
		address: {
			streetAddress: string,
			city: string,
			country: {
				code: string,
				name: string
			},
			postalCode: string
		},
		phone: string,
		fax: string,
		email: string,
		websiteUrl: string,
		socialLinks: {
			facebookUrl: string,
			linkedinUrl: string,
			twitterUrl: string
		},
		contactName: string
	};
	geoLocation: {
		lng: number,
		lat: number
	};
	logoUrl: string;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "versionId",
				validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
			},
			{
				key: "contactDetails",
				validationStruct: new ObjectValidationStructure([
					{
						key: "vatCode",
						validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxVatCodeNameLength))
					},
					{
						key: "name",
						validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxHotelNameLength))
					},
					{
						key: "address",
						validationStruct: new ObjectValidationStructure([
							{
								key: "streetAddress",
								validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxStreetAddressLength))
							},
							{
								key: "city",
								validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxCityLength))
							},
							{
								key: "country",
								validationStruct: new ObjectValidationStructure([
									{
										key: "code",
										validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxCountryCodeLength))
									},
									{
										key: "name",
										validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxCountryLength))
									}
								])
							},
							{
								key: "postalCode",
								validationStruct: new PrimitiveValidationStructure(new StringValidationRule(50))
							}
						])
					},
					{
						key: "phone",
						validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxPhoneLength))
					},
					{
						key: "fax",
						validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxPhoneLength))
					},
					{
						key: "email",
						validationStruct: new PrimitiveValidationStructure(new EmailValidationRule())
					},
					{
						key: "websiteUrl",
						validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxUrlLength))
					},
					{
						key: "socialLinks",
						validationStruct: new ObjectValidationStructure([
							{
								key: "facebookUrl",
								validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxUrlLength))
							},
							{
								key: "linkedinUrl",
								validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxUrlLength))
							},
							{
								key: "twitterUrl",
								validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxUrlLength))
							}
						])
					},
					{
						key: "contactName",
						validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxNameLength))
					}
				])
			},
			{
				key: "geoLocation",
				validationStruct: new ObjectValidationStructure([
					{
						key: "lng",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildNullable())
					},
					{
						key: "lat",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildNullable())
					}
				])
			},
			{
				key: "logoUrl",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxUrlLength))
			}
		]);
	}
}