import {BaseDO} from '../../../../common/base/BaseDO';
import {AddressDO} from '../../../../common/data-objects/address/AddressDO';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ICustomerDetailsDO} from '../ICustomerDetailsDO';

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
	public canPayInvoiceByAgreement(): boolean {
		return false;
	}
	public canReceiveBookingConfirmations(): boolean {
		return true;
	}
}