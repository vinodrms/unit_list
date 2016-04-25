import {BaseDO} from '../../../../common/base/BaseDO';
import {AddressDO} from '../../../../common/data-objects/address/AddressDO';
import {ICustomerDetailsDO} from '../ICustomerDetailsDO';

export enum CommissionType {
	Fixed, Percentage
}

export class BaseCorporateDetailsDO extends BaseDO implements ICustomerDetailsDO {
	constructor() {
		super();
	}
	vatCode: string;
	governmentCode: string;
	name: string;
	address: AddressDO;
	phone: string;
	fax: string;
	email: string;
	websiteUrl: string;
	contactName: string;
	payInvoiceByAgreement: boolean;
	invoiceFee: number;
	accountNo: string;
	commissionType: CommissionType;
	commission: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["vatCode", "governmentCode", "name", "phone", "fax", "email", "websiteUrl", "contactName", "payInvoiceByAgreement",
			"invoiceFee", "accountNo", "commissionType", "commission"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.address = new AddressDO();
		this.address.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "address"));
	}
	public getAddress(): AddressDO {
		return this.address;
	}
	public getName(): string {
		return this.name;
	}
}