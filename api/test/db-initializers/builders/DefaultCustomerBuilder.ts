import {ThError} from '../../../core/utils/th-responses/ThError';
import {CustomerDO, CustomerStatus, CustomerType} from '../../../core/data-layer/customers/data-objects/CustomerDO';
import {CustomerPriceProductDetailsDO} from '../../../core/data-layer/customers/data-objects/price-product-details/CustomerPriceProductDetailsDO';
import {PriceProductAvailability} from '../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {TestContext} from '../../helpers/TestContext';
import {ThUtils} from '../../../core/utils/ThUtils';
import {IndividualDetailsDO} from '../../../core/data-layer/customers/data-objects/customer-details/individual/IndividualDetailsDO';
import {CompanyDetailsDO} from '../../../core/data-layer/customers/data-objects/customer-details/corporate/CompanyDetailsDO';
import {TravelAgencyDetailsDO} from '../../../core/data-layer/customers/data-objects/customer-details/corporate/TravelAgencyDetailsDO';
import {BaseCorporateDetailsDO} from '../../../core/data-layer/customers/data-objects/customer-details/corporate/BaseCorporateDetailsDO';
import {ICustomerDetailsDO} from '../../../core/data-layer/customers/data-objects/customer-details/ICustomerDetailsDO';
import {AddressDO} from '../../../core/data-layer/common/data-objects/address/AddressDO';
import {ThDateDO} from '../../../core/utils/th-dates/data-objects/ThDateDO';

export interface ICustomerDataSource {
	getCustomerList(): CustomerDO[];
}

export class DefaultCustomerBuilder implements ICustomerDataSource {
	constructor(private _testContext: TestContext) {
	}

	getCustomerList(): CustomerDO[] {
		var customerList = [];
		customerList.push(DefaultCustomerBuilder.buildCustomerDO(this._testContext, CustomerType.Individual, "Ionut Paraschiv", "Masina de Paine 20"));
		customerList.push(DefaultCustomerBuilder.buildCustomerDO(this._testContext, CustomerType.TravelAgency, "booking.com", "23 Sunset Blvd"));
		customerList.push(DefaultCustomerBuilder.buildCustomerDO(this._testContext, CustomerType.Company, "Threeangle Software Solutions SRL", "6D Regiei Blvd"));
		return customerList;
	}

	public static buildCustomerDO(testContext: TestContext, customerType: CustomerType, individualOrCompanyName: string, streetAddress: string): CustomerDO {
		var thUtils = new ThUtils();

		var cust = new CustomerDO();

		cust.fileAttachmentUrlList = [];
		cust.hotelId = testContext.sessionContext.sessionDO.hotel.id;
		cust.notes = "tes ttest test test";

		var priceProductDetails = new CustomerPriceProductDetailsDO();
		priceProductDetails.bookingCode = thUtils.generateUniqueID();
		priceProductDetails.priceProductIdList = [];
		priceProductDetails.priceProductAvailability = PriceProductAvailability.Public;
		cust.priceProductDetails = priceProductDetails;

		cust.status = CustomerStatus.Active;
		cust.type = customerType;
		cust.versionId = 0;
		cust.customerDetails = DefaultCustomerBuilder.buildCustomerDetails(customerType, individualOrCompanyName, streetAddress);

		return cust;
	}
	private static buildCustomerDetails(customerType: CustomerType, individualOrCompanyName: string, streetAddress: string): ICustomerDetailsDO {
		switch (customerType) {
			case CustomerType.Individual:
				return DefaultCustomerBuilder.buildIndividualCustomerDetails(individualOrCompanyName, streetAddress);
			case CustomerType.Company:
				return DefaultCustomerBuilder.buildCompanyCustomerDetails(individualOrCompanyName, streetAddress);
			case CustomerType.TravelAgency:
				return DefaultCustomerBuilder.buildTravelAgencyCustomerDetails(individualOrCompanyName, streetAddress);
		}
	}
	private static buildIndividualCustomerDetails(name: string, streetAddress: string): IndividualDetailsDO {
		var details = new IndividualDetailsDO();
		details.address = new AddressDO();
		details.address.streetAddress = streetAddress;
		details.birthday = new ThDateDO();
		details.birthday.day = 22;
		details.birthday.month = 0;
		details.birthday.year = 1989;
		details.firstName = name;
		details.lastName = name;
		details.passportNo = "1234";
		return details;
	}
	private static buildCompanyCustomerDetails(name: string, streetAddress: string): CompanyDetailsDO {
		return DefaultCustomerBuilder.buildCorporateCustomerDetails(name, streetAddress);
	}
	private static buildTravelAgencyCustomerDetails(name: string, streetAddress: string): TravelAgencyDetailsDO {
		return DefaultCustomerBuilder.buildCorporateCustomerDetails(name, streetAddress);
	}
	private static buildCorporateCustomerDetails(name: string, streetAddress: string): BaseCorporateDetailsDO {
		var details = new BaseCorporateDetailsDO();
		details.accountNo = "RO21678361237127831";
		details.address = new AddressDO();
		details.address.streetAddress = streetAddress;
		details.commission = 0.1;
		details.contactName = "Ionut Paraschiv";
		details.name = name;
		details.payInvoiceByAgreement = true;
		details.phone = "217893129371";
		details.vatCode = "RO34121562";
		details.websiteUrl = "www.3angle.tech";
		return details;
	}

	public loadCustomers(dataSource: ICustomerDataSource): Promise<CustomerDO[]> {
		return new Promise<CustomerDO[]>((resolve: { (result: CustomerDO[]): void }, reject: { (err: ThError): void }) => {
			this.loadCustomersCore(resolve, reject, dataSource);
		});
	}
	private loadCustomersCore(resolve: { (result: CustomerDO[]): void }, reject: { (err: ThError): void }, dataSource: ICustomerDataSource) {
		var customerList: CustomerDO[] = dataSource.getCustomerList();
		var customerRepository = this._testContext.appContext.getRepositoryFactory().getCustomerRepository();

		var custPromiseList: Promise<CustomerDO>[] = [];
		customerList.forEach((customer: CustomerDO) => {
			custPromiseList.push(customerRepository.addCustomer({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, customer));
		});
		Promise.all(custPromiseList).then((customerList: CustomerDO[]) => {
			resolve(customerList);
		}).catch((error: any) => {
			reject(error);
		});
	}
}