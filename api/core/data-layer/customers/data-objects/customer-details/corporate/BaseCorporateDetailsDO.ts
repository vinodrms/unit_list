import {BaseDO} from '../../../../common/base/BaseDO';
import {AddressDO} from '../../../../common/data-objects/address/AddressDO';
import {ICustomerDetailsDO} from '../ICustomerDetailsDO';

export class BaseCorporateDetailsDO extends BaseDO implements ICustomerDetailsDO {
	constructor() {
		super();
	}
	vatCode: string;
	name: string;
	address: AddressDO;
	phone: string;
	fax: string;
	email: string;
	websiteUrl: string;
	contactName: string;
	payInvoiceByAgreement: boolean;
	accountNo: string;
	commission: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["vatCode", "name", "phone", "fax", "email", "websiteUrl", "contactName", "payInvoiceByAgreement", "accountNo", "commission"];
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