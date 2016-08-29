import {BaseDO} from '../../../../../../common/base/BaseDO';
import {AddressDO} from '../../../common/data-objects/address/AddressDO';
import {CommissionDO} from '../../../common/data-objects/commission/CommissionDO';
import {ICustomerDetailsDO} from './ICustomerDetailsDO';

export class CorporateDetailsDO extends BaseDO implements ICustomerDetailsDO {
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
	commission: CommissionDO;
	receiveBookingConfirmations: boolean;

	protected getPrimitivePropertyKeys(): string[] {
		return ["vatCode", "governmentCode", "name", "phone", "fax", "email", "websiteUrl", "contactName", "payInvoiceByAgreement",
			"invoiceFee", "accountNo", "receiveBookingConfirmations"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.address = new AddressDO();
		this.address.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "address"));

		this.commission = new CommissionDO();
		this.commission.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "commission"));
	}
	public getAddress(): AddressDO {
		return this.address;
	}
	public getName(): string {
		return this.name;
	}
	public getEmail(): string {
		return this.email;
	}
	public getPhone(): string {
		return this.phone;
	}
	public canPayInvoiceByAgreement(): boolean {
		return this.payInvoiceByAgreement;
	}
	public canReceiveBookingConfirmations(): boolean {
		return this.receiveBookingConfirmations;
	}
}