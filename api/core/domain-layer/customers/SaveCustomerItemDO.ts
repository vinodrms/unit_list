import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {NumberValidationRule} from '../../utils/th-validation/rules/NumberValidationRule';
import {NumberInListValidationRule} from '../../utils/th-validation/rules/NumberInListValidationRule';
import {EmailValidationRule} from '../../utils/th-validation/rules/EmailValidationRule';
import {BooleanValidationRule} from '../../utils/th-validation/rules/BooleanValidationRule';
import {CustomerType} from '../../data-layer/customers/data-objects/CustomerDO';
import {ICommissionDO, CommissionDO, CommissionType} from '../../data-layer/common/data-objects/commission/CommissionDO';
import {PriceProductAvailability} from '../../data-layer/price-products/data-objects/PriceProductDO';

export interface CustomerItemAddressDO {
	streetAddress?: string;
	city?: string;
	country: {
		code?: string;
		name?: string;
	}
	postalCode?: string;
}
interface CustomerItemDetailsDO {
	address: CustomerItemAddressDO;
	email?: string;
	phone?: string;
}
export interface IndividualCustomerItemDetailsDO extends CustomerItemDetailsDO {
	firstName: string;
	lastName: string;
	passportNo?: string;
	birthday: {
		year?: number;
		month?: number;
		day?: number;
	}
}
interface CorporateCustomerItemDetailsDO extends CustomerItemDetailsDO {
	vatCode?: string;
	governmentCode?: string;
	name: string;
	fax?: string;
	websiteUrl?: string;
	contactName?: string;
	payInvoiceByAgreement: boolean;
	invoiceFee?: number;
	accountNo?: string;
	commission: ICommissionDO;
	receiveBookingConfirmations: boolean;
}
export interface CompanyCustomerItemDetailsDO extends CorporateCustomerItemDetailsDO {
}
export interface TravelAgencyCustomerItemDetailsDO extends CorporateCustomerItemDetailsDO {
}
export interface CustomerFileAttachment {
	name: string;
	url: string;
}

export class SaveCustomerItemDO {
	type: CustomerType;
	customerDetails: any;
	fileAttachmentList: CustomerFileAttachment[];
	priceProductDetails: {
		allowPublicPriceProducts: boolean;
		priceProductIdList: string[];
	};
	notes: string;

	public static getValidationStructure(customerType: CustomerType): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "id",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
			},
			{
				key: "type",
				validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([CustomerType.Individual, CustomerType.Company, CustomerType.TravelAgency]))
			},
			{
				key: "customerDetails",
				validationStruct: SaveCustomerItemDO.getCustomerDetailsValidationStructure(customerType)
			},
			{
				key: "fileAttachmentList",
				validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
					{
						key: "name",
						validationStruct: new PrimitiveValidationStructure(new StringValidationRule(2000))
					},
					{
						key: "url",
						validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxUrlLength))
					}
				]))
			},
			{
				key: "priceProductDetails",
				validationStruct: new ObjectValidationStructure([
					{
						key: "allowPublicPriceProducts",
						validationStruct: new PrimitiveValidationStructure(new BooleanValidationRule())
					},
					{
						key: "priceProductIdList",
						validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
					}
				])
			},
			{
				key: "notes",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
			}
		])
	}
	private static getCustomerDetailsValidationStructure(customerType: CustomerType): IValidationStructure {
		switch (customerType) {
			case CustomerType.Individual:
				return SaveCustomerItemDO.getIndividualCustomerDetailsValidationStructure();
			case CustomerType.Company:
				return SaveCustomerItemDO.getCompanyCustomerDetailsValidationStructure();
			default:
				return SaveCustomerItemDO.getTravelAgencyCustomerDetailsValidationStructure();
		}
	}
	private static getIndividualCustomerDetailsValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "firstName",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxNameLength))
			},
			{
				key: "lastName",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxNameLength))
			},
			{
				key: "address",
				validationStruct: SaveCustomerItemDO.getAddressValidationStructure()
			},
			{
				key: "email",
				validationStruct: new PrimitiveValidationStructure(EmailValidationRule.buildNullable())
			},
			{
				key: "phone",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxPhoneLength))
			},
			{
				key: "passportNo",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(100))
			},
			{
				key: "birthday",
				validationStruct: new ObjectValidationStructure([
					{
						key: "year",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildNullableIntegerNumberRule(1900))
					},
					{
						key: "month",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildNullableIntegerNumberRule(0))
					},
					{
						key: "day",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildNullableIntegerNumberRule(0))
					}
				])
			}
		]);
	}
	private static getCompanyCustomerDetailsValidationStructure(): IValidationStructure {
		return SaveCustomerItemDO.getCorporateCustomerDetailsValidationStructure();
	}
	private static getTravelAgencyCustomerDetailsValidationStructure(): IValidationStructure {
		return SaveCustomerItemDO.getCorporateCustomerDetailsValidationStructure();
	}
	private static getCorporateCustomerDetailsValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "vatCode",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxVatCodeNameLength))
			},
			{
				key: "governmentCode",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
			},
			{
				key: "name",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxNameLength))
			},
			{
				key: "address",
				validationStruct: SaveCustomerItemDO.getAddressValidationStructure()
			},
			{
				key: "email",
				validationStruct: new PrimitiveValidationStructure(EmailValidationRule.buildNullable())
			},
			{
				key: "phone",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxPhoneLength))
			},
			{
				key: "fax",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxPhoneLength))
			},
			{
				key: "websiteUrl",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxUrlLength))
			},
			{
				key: "contactName",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxNameLength))
			},
			{
				key: "payInvoiceByAgreement",
				validationStruct: new PrimitiveValidationStructure(new BooleanValidationRule())
			},
			{
				key: "invoiceFee",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildNullablePriceNumberRule())
			},
			{
				key: "accountNo",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(200))
			},
			{
				key: "commission",
				validationStruct: new ObjectValidationStructure([
					{
						key: "type",
						validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([CommissionType.Fixed, CommissionType.Percentage]))
					},
					{
						key: "amount",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildNullable())
					}
				])
			},
			{
				key: "receiveBookingConfirmations",
				validationStruct: new PrimitiveValidationStructure(new BooleanValidationRule())
			}
		]);
	}

	private static getAddressValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "streetAddress",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxStreetAddressLength))
			},
			{
				key: "city",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxCityLength))
			},
			{
				key: "country",
				validationStruct: new ObjectValidationStructure([
					{
						key: "code",
						validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxCountryCodeLength))
					},
					{
						key: "name",
						validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(StringValidationRule.MaxCountryLength))
					}
				])
			},
			{
				key: "postalCode",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(50))
			}
		])
	}
}