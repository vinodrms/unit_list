import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {SaveCustomerItemDO, CompanyCustomerItemDetailsDO, CustomerItemAddressDO,
	TravelAgencyCustomerItemDetailsDO, IndividualCustomerItemDetailsDO} from '../../../../../core/domain-layer/customers/SaveCustomerItemDO';
import {CustomerDO, CustomerType} from '../../../../../core/data-layer/customers/data-objects/CustomerDO';
import {PriceProductAvailability} from '../../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {CommissionType} from '../../../../../core/data-layer/customers/data-objects/customer-details/corporate/BaseCorporateDetailsDO';

export class CustomersTestHelper {
	constructor(private _dataBuilder: DefaultDataBuilder, private _testContext: TestContext) {
	}
	public getIndividualCustomer(): SaveCustomerItemDO {
		var individual = this.getSaveCustomerItemDO(CustomerType.Individual, "just another individual customer");
		individual.customerDetails = this.getIndividualCustDetails();
		return individual;
	}
	private getIndividualCustDetails(): IndividualCustomerItemDetailsDO {
		return {
			firstName: "Catalin Andrei",
			lastName: "Dobre",
			birthday: {
				day: 10,
				month: 10,
				year: 1989
			},
			address: {
				city: "Bucharest",
				country: {
					code: "RO",
					name: "Romania"
				},
				streetAddress: "35 Tineretului Boulevard",
				postalCode: "21321"
			}
		}
	}
	public getCompanyCustomer(priceProductId: string): SaveCustomerItemDO {
		var company = this.getSaveCustomerItemDO(CustomerType.Company, "just another company");
		company.priceProductDetails.allowPublicPriceProducts = false;
		company.priceProductDetails.priceProductIdList = [priceProductId];
		company.customerDetails = this.getCompanyCustDetails();
		return company;
	}
	private getCompanyCustDetails(): CompanyCustomerItemDetailsDO {
		return {
			name: "Threeangle Software Solutions SRL",
			accountNo: "RO89INGB3261783612",
			address: {
				city: "Bucharest",
				country: {
					code: "RO",
					name: "Romania"
				},
				postalCode: "3276831",
				streetAddress: "6D Regiei Boulevard"
			},
			commissionType: CommissionType.Percentage,
			commission: 0.2,
			contactName: "Ionut Paraschiv",
			email: "ionut.paraschiv@3angle.tech",
			payInvoiceByAgreement: false,
			vatCode: "RO34121562"
		}
	}

	private getSaveCustomerItemDO(custType: CustomerType, notes: string): SaveCustomerItemDO {
		return {
			fileAttachmentList: [],
			notes: notes,
			type: custType,
			priceProductDetails: {
				priceProductIdList: [],
				allowPublicPriceProducts: true
			},
			customerDetails: this.getIndividualCustDetails()
		}
	}
}