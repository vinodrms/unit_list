import {ThError} from '../../../utils/th-responses/ThError';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';

export interface ICustomerItemActionStrategy {
	save(resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void });
}