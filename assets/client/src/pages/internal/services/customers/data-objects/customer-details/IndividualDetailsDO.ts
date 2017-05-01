import { BaseDO } from '../../../../../../common/base/BaseDO';
import { AddressDO } from '../../../common/data-objects/address/AddressDO';
import { ICustomerDetailsDO } from './ICustomerDetailsDO';
import { ThDateDO } from '../../../common/data-objects/th-dates/ThDateDO';
import { ContactDetailsDO } from './ContactDetailsDO';

export class IndividualDetailsDO extends BaseDO implements ICustomerDetailsDO {
	constructor() {
		super();
	}
	firstName: string;
	lastName: string;
	address: AddressDO;
	passportNo: string;
	birthday: ThDateDO;
	contactDetailsList: ContactDetailsDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["firstName", "lastName", "passportNo"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.address = new AddressDO();
		this.address.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "address"));
		this.birthday = new ThDateDO();
		this.birthday.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "birthday"));
		this.contactDetailsList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "contactDetailsList"), (contactDetailsObject: Object) => {
			var contactDetailsDO = new ContactDetailsDO();
			contactDetailsDO.buildFromObject(contactDetailsObject);
			this.contactDetailsList.push(contactDetailsDO);
		});
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
	public canGuaranteePayment(): boolean {
		return true;
	}
	public canReceiveBookingConfirmations(): boolean {
		return true;
	}
	public getContactDetailsList(): ContactDetailsDO[] {
		return this.contactDetailsList;
	}
}