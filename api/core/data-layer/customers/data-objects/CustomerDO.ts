import {BaseDO} from '../../common/base/BaseDO';
import {FileAttachmentDO} from '../../common/data-objects/file/FileAttachmentDO';
import {CustomerPriceProductDetailsDO} from './price-product-details/CustomerPriceProductDetailsDO';
import {IndividualDetailsDO} from './customer-details/individual/IndividualDetailsDO';
import {CompanyDetailsDO} from './customer-details/corporate/CompanyDetailsDO';
import {TravelAgencyDetailsDO} from './customer-details/corporate/TravelAgencyDetailsDO';
import {ICustomerDetailsDO} from './customer-details/ICustomerDetailsDO';

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
	customerDetails: ICustomerDetailsDO;
	fileAttachmentList: FileAttachmentDO[];
	priceProductDetails: CustomerPriceProductDetailsDO;
	notes: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "hotelId", "versionId", "type", "status", "notes"];
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

		this.fileAttachmentList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "fileAttachmentList"), (fileAttachmentObject: Object) => {
			var fileAttachmentDO = new FileAttachmentDO();
			fileAttachmentDO.buildFromObject(fileAttachmentObject);
			this.fileAttachmentList.push(fileAttachmentDO);
		});

		this.priceProductDetails = new CustomerPriceProductDetailsDO();
		this.priceProductDetails.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "priceProductDetails"));
	}
	public isCompanyOrTravelAgency(): boolean {
		return this.type === CustomerType.Company || this.type === CustomerType.TravelAgency;
	}
	public isIndividual(): boolean {
		return this.type === CustomerType.Individual;
	}
}