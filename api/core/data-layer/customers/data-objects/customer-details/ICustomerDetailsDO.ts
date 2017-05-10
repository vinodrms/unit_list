import { AddressDO } from '../../../common/data-objects/address/AddressDO';
import { BaseDO } from '../../../common/base/BaseDO';
import { CommissionDO } from "../../../common/data-objects/commission/CommissionDO";
import { ContactDetailsDO } from "./ContactDetailsDO";

export interface ICustomerDetailsDO extends BaseDO {
	getAddress(): AddressDO;
	getName(): string;
	canPayInvoiceByAgreement(): boolean;
	canReceiveBookingConfirmations(): boolean;
	roundPricesToTwoDecimals();
	getVatCode(): string;
	getGovernmentCode(): string;
	getCommission(): CommissionDO;
	getContactDetailsList(): ContactDetailsDO[];
}