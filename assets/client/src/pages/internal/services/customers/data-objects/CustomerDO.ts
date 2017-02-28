import { BaseDO } from '../../../../../common/base/BaseDO';
import { FileAttachmentDO } from '../../common/data-objects/file/FileAttachmentDO';
import { CustomerPriceProductDetailsDO } from './price-product-details/CustomerPriceProductDetailsDO';
import { ICustomerDetailsDO } from './customer-details/ICustomerDetailsDO';
import { CustomerDetailsFactory } from './customer-details/CustomerDetailsFactory';
import { PriceProductDO, PriceProductAvailability } from '../../price-products/data-objects/PriceProductDO';

export enum CustomerType {
	Individual,
	Company,
	TravelAgency
}

export class CustomerDO extends BaseDO {
	constructor() {
		super();
	}
	id: string;
	versionId: number;
	type: CustomerType;
	customerDetails: ICustomerDetailsDO;
	fileAttachmentList: FileAttachmentDO[];
	priceProductDetails: CustomerPriceProductDetailsDO;
	notes: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "versionId", "type", "notes"];
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
	public isCompanyOrTravelAgency(): boolean {
		return this.type === CustomerType.Company || this.type === CustomerType.TravelAgency;
	}
	public get customerName(): string {
		return this.customerDetails.getName();
	}
	public get emailString(): string {
		if (!this.customerDetails.getEmail() ||
			!_.isString(this.customerDetails.getEmail())) {
			return "";
		}
		return this.customerDetails.getEmail();
	}
	public get customerNameAndEmailString(): string {
		var custNameEmailStr = this.customerDetails.getName();
		var emailStr = this.emailString;
		if (emailStr.length > 0) {
			custNameEmailStr += " - " + emailStr;
		}
		return custNameEmailStr;
	}

	public hasAccessOnPriceProduct(priceProduct: PriceProductDO): boolean {
		if (this.isIndividual()) {
			return true;
		}
		if (this.priceProductDetails.allowPublicPriceProducts && priceProduct.availability === PriceProductAvailability.Public) {
			return true;
		}
		return _.contains(this.priceProductDetails.priceProductIdList, priceProduct.id);
	}
	public canCreateWalkInInvoices(): boolean {
		return !this.customerDetails.canPayInvoiceByAgreement();
	}
}