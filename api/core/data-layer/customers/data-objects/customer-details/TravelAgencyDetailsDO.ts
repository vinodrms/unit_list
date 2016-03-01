import {BaseDO} from '../../../common/base/BaseDO';
import {AddressDO} from '../../../common/data-objects/address/AddressDO';

export class TravelAgencyDetailsDO extends BaseDO {
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
	sendInvoice: boolean;
	accountNo: string;
	commission: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["vatCode", "name", "phone", "fax", "email", "websiteUrl", "contactName", "sendInvoice", "accountNo", "commission"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.address = new AddressDO();
		this.address.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "address"));
	}
}