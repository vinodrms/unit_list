import {ThError} from '../../../utils/th-responses/ThError';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';

export interface IAddOnProductItemActionStrategy {
	save(resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void });
}