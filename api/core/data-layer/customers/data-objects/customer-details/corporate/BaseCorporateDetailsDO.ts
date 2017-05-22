import { BaseDO } from '../../../../common/base/BaseDO';
import { AddressDO } from '../../../../common/data-objects/address/AddressDO';
import { ICustomerDetailsDO } from '../ICustomerDetailsDO';
import { CommissionDO } from '../../../../common/data-objects/commission/CommissionDO';
import { ThUtils } from '../../../../../utils/ThUtils';
import { ContactDetailsDO } from "../ContactDetailsDO";

export class BaseCorporateDetailsDO extends BaseDO implements ICustomerDetailsDO {
	constructor() {
		super();
	}
	vatCode: string;
	governmentCode: string;
	name: string;
	address: AddressDO;
	websiteUrl: string;
	payInvoiceByAgreement: boolean;
	invoiceFee: number;
	accountNo: string;
	commission: CommissionDO;
	receiveBookingConfirmations: boolean;
	contactDetailsList: ContactDetailsDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["vatCode", "governmentCode", "name", "websiteUrl", "payInvoiceByAgreement",
			"invoiceFee", "accountNo", "receiveBookingConfirmations"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.address = new AddressDO();
		this.address.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "address"));

		this.commission = new CommissionDO();
		this.commission.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "commission"));
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
		return this.name;
	}
	public getFirstName(): string {
		return "";
	}
	public getLastName(): string {
		return "";
	}
	public canPayInvoiceByAgreement(): boolean {
		return this.payInvoiceByAgreement;
	}
	public canReceiveBookingConfirmations(): boolean {
		return this.receiveBookingConfirmations;
	}
	public roundPricesToTwoDecimals() {
		var thUtils = new ThUtils();
		this.invoiceFee = thUtils.roundNumberToTwoDecimals(this.invoiceFee);
		this.commission.amount = thUtils.roundNumberToTwoDecimals(this.commission.amount);
	}
	public getVatCode(): string {
		return this.vatCode;
	}
	public getGovernmentCode(): string {
		return this.governmentCode;
	}
	public getCommission(): CommissionDO {
		return this.commission;
	}
	public getContactDetailsList(): ContactDetailsDO[] {
		return this.contactDetailsList;
	}
}