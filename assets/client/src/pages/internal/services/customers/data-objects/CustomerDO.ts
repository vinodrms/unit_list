import {BaseDO} from '../../../../../common/base/BaseDO';
import {FileAttachmentDO} from '../../common/data-objects/file/FileAttachmentDO';
import {CustomerPriceProductDetailsDO} from './price-product-details/CustomerPriceProductDetailsDO';
import {ICustomerDetailsDO} from './customer-details/ICustomerDetailsDO';
import {CustomerDetailsFactory} from './customer-details/CustomerDetailsFactory';

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
	versionId: number;
	type: CustomerType;
	status: CustomerStatus;
	customerDetails: ICustomerDetailsDO;
	fileAttachmentList: FileAttachmentDO[];
	priceProductDetails: CustomerPriceProductDetailsDO;
	notes: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "versionId", "type", "status", "notes"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		var custDetailsFactory = new CustomerDetailsFactory();
		this.customerDetails = custDetailsFactory.getCustomerDetailsByType(this.type);
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
	
	public isIndividual(): boolean {
		return this.type === CustomerType.Individual;
	}
	public isCompany(): boolean {
		return this.type === CustomerType.Company;
	}
	public isTravelAgency(): boolean {
		return this.type === CustomerType.TravelAgency;
	}
}