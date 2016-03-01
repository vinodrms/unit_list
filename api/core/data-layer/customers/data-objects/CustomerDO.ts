import {BaseDO} from '../../common/base/BaseDO';
import {CustomerPriceProductDetailsDO} from './price-product-details/CustomerPriceProductDetailsDO';
import {CompanyDetailsDO} from './customer-details/CompanyDetailsDO';
import {IndividualDetailsDO} from './customer-details/IndividualDetailsDO';
import {TravelAgencyDetailsDO} from './customer-details/TravelAgencyDetailsDO';

export enum CustomerType {
	Individual,
	Company,
	TravelAgency
}
export enum CustomerStatus {
	Active,
	Deleted
}

export class CustomerDO extends BaseDO {
	constructor() {
		super();
	}
	id: string;
	hotelId: string;
	versionId: number;
	type: CustomerType;
	status: CustomerStatus;
	customerDetails: BaseDO;
	agreementUrl: string;
	priceProductDetails: CustomerPriceProductDetailsDO;
	linkedCustomerIdList: string[];
	notes: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "hotelId", "versionId", "type", "status", "agreementUrl", "linkedCustomerIdList", "notes"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		switch (this.type) {
			case CustomerType.Individual:
				this.customerDetails = new IndividualDetailsDO();
				break;
			case CustomerType.Company:
				this.customerDetails = new CompanyDetailsDO();
				break;
			case CustomerType.TravelAgency:
				this.customerDetails = new TravelAgencyDetailsDO();
				break;
		}
		this.customerDetails.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "customerDetails"));

		this.priceProductDetails = new CustomerPriceProductDetailsDO();
		this.priceProductDetails.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "priceProductDetails"));
	}

	public isValid(): boolean {
		return this.isValidCustomerType();
	}
	private isValidCustomerType(): boolean {
		return this.type === CustomerType.Individual || this.type === CustomerType.Company || this.type === CustomerType.TravelAgency;
	}
}