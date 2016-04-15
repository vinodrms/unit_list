import {BaseDO} from '../../../../../../common/base/BaseDO';
import {AddressDO} from '../../../common/data-objects/address/AddressDO';
import {CustomerType} from '../CustomerDO';

export interface ICustomerDetailsDO extends BaseDO {
	getAddress(): AddressDO;
	getName(): string;
	getEmail(): string;
	getPhone(): string;
}

export interface CustomerDetailsMeta {
	customerTypeName: string;
	customerType: CustomerType;
}