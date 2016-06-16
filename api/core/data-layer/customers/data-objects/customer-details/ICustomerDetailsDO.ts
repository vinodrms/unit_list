import {AddressDO} from '../../../common/data-objects/address/AddressDO';
import {BaseDO} from '../../../common/base/BaseDO';

export interface ICustomerDetailsDO extends BaseDO {
	getAddress(): AddressDO;
	getName(): string;
	canPayInvoiceByAgreement(): boolean;
}