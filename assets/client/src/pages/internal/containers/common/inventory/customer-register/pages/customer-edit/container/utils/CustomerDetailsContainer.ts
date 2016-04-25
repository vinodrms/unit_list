import {CorporateCustomerDetailsComponent} from '../../customer-details/corporate/CorporateCustomerDetailsComponent';
import {IndividualCustomerDetailsComponent} from '../../customer-details/individual/IndividualCustomerDetailsComponent';
import {CorporateDetailsDO} from '../../../../../../../../services/customers/data-objects/customer-details/CorporateDetailsDO';
import {IndividualDetailsDO} from '../../../../../../../../services/customers/data-objects/customer-details/IndividualDetailsDO';
import {CustomerDetailsFactory} from '../../../../../../../../services/customers/data-objects/customer-details/CustomerDetailsFactory';
import {CustomerDO, CustomerType} from '../../../../../../../../services/customers/data-objects/CustomerDO';

export class CustomerDetailsContainer {
	private _custDetailsFactory: CustomerDetailsFactory;
	private _individualDetailsDO: IndividualDetailsDO;
	private _corporateDetailsDO: CorporateDetailsDO;

	constructor(private _corporateCustomerDetailsComponent: CorporateCustomerDetailsComponent,
		private _individualCustDetailsComponent: IndividualCustomerDetailsComponent) {
		this._custDetailsFactory = new CustomerDetailsFactory();
	}

	public initializeFrom(customer: CustomerDO) {
		if (customer.isIndividual()) {
			this._individualDetailsDO = <IndividualDetailsDO>customer.customerDetails;
			this._corporateDetailsDO = <CorporateDetailsDO>this._custDetailsFactory.getCustomerDetailsByType(CustomerType.Company);
		}
		else {
			this._individualDetailsDO = <IndividualDetailsDO>this._custDetailsFactory.getCustomerDetailsByType(CustomerType.Individual);
			this._corporateDetailsDO = <CorporateDetailsDO>customer.customerDetails;
		}
	}

	public get individualDetailsDO(): IndividualDetailsDO {
		return this._individualDetailsDO;
	}
	public set individualDetailsDO(individualDetailsDO: IndividualDetailsDO) {
		this._individualDetailsDO = individualDetailsDO;
	}
	public get corporateDetailsDO(): CorporateDetailsDO {
		return this._corporateDetailsDO;
	}
	public set corporateDetailsDO(corporateDetailsDO: CorporateDetailsDO) {
		this._corporateDetailsDO = corporateDetailsDO;
	}

	public isValid(customer: CustomerDO): boolean {
		if (customer.isIndividual()) {
			return this._individualCustDetailsComponent.isValid();
		}
		return this._corporateCustomerDetailsComponent.isValid();
	}
	public updateCustomerDetailsOn(customer: CustomerDO) {
		if (customer.isIndividual()) {
			customer.customerDetails = this._individualCustDetailsComponent.getCustomerDetails();
		}
		else {
			customer.customerDetails = this._corporateCustomerDetailsComponent.getCustomerDetails();
		}
	}
}