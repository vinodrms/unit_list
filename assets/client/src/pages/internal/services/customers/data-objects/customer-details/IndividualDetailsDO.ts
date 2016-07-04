import {BaseDO} from '../../../../../../common/base/BaseDO';
import {AddressDO} from '../../../common/data-objects/address/AddressDO';
import {ICustomerDetailsDO} from './ICustomerDetailsDO';
import {ThDateDO} from '../../../common/data-objects/th-dates/ThDateDO';

export class IndividualDetailsDO extends BaseDO implements ICustomerDetailsDO {
	constructor() {
		super();
	}
	firstName: string;
	lastName: string;
	address: AddressDO;
	email: string;
	phone: string;
	passportNo: string;
	birthday: ThDateDO;

	protected getPrimitivePropertyKeys(): string[] {
		return ["firstName", "lastName", "email", "phone", "passportNo"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.address = new AddressDO();
		this.address.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "address"));
		this.birthday = new ThDateDO();
		this.birthday.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "birthday"));
	}
	public getAddress(): AddressDO {
		return this.address;
	}
	public getName(): string {
		return this.firstName + " " + this.lastName;
	}
	public getEmail(): string {
		return this.email;
	}
	public getPhone(): string {
		return this.phone;
	}
	public canPayInvoiceByAgreement(): boolean {
		return false;
	}
}