import { BaseDO } from '../../../../../../common/base/BaseDO';
import { AddressDO } from '../../../common/data-objects/address/AddressDO';
import { CustomerType } from '../CustomerDO';
import { ContactDetailsDO } from './ContactDetailsDO';

export interface ICustomerDetailsDO extends BaseDO {
	getAddress(): AddressDO;
	getName(): string;
	canPayInvoiceByAgreement(): boolean;
	canGuaranteePayment(): boolean;
	canReceiveBookingConfirmations(): boolean;
	getContactDetailsList(): ContactDetailsDO[];
}

export interface CustomerDetailsMeta {
	customerTypeName: string;
	customerType: CustomerType;
	fontName: string;
}