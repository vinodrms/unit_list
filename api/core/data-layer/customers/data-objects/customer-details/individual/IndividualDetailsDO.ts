import { BaseDO } from '../../../../common/base/BaseDO';
import { AddressDO } from '../../../../common/data-objects/address/AddressDO';
import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { ICustomerDetailsDO } from '../ICustomerDetailsDO';
import { CommissionDO, CommissionType } from "../../../../common/data-objects/commission/CommissionDO";
import { ContactDetailsDO } from "../ContactDetailsDO";

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
	public getFirstName(): string {
		return this.firstName;
	}
	public getLastName(): string {
		return this.lastName;
	}
	public canPayInvoiceByAgreement(): boolean {
		return false;
	}
	public canReceiveBookingConfirmations(): boolean {
		return true;
	}
	public roundPricesToTwoDecimals() {
	}
	public getVatCode(): string {
		return "";
	}
	public getGovernmentCode(): string {
		return "";
	}
	public getCommission(): CommissionDO {
		let commission = new CommissionDO();
		commission.type = CommissionType.Fixed;
		commission.amount = 0.0;
		commission.deducted = false;
		return commission;
	}
	public getContactDetailsList(): ContactDetailsDO[] {
		return this.contactDetailsList;
	}
}