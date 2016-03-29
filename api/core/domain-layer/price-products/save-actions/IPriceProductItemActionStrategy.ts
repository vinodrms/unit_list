import {ThError} from '../../../utils/th-responses/ThError';
import {PriceProductDO} from '../../../data-layer/price-products/data-objects/PriceProductDO';

export interface IPriceProductItemActionStrategy {
	save(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void });
}