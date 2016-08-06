import {ThDateIntervalDO} from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {PriceProductDO} from '../../../../data-layer/price-products/data-objects/PriceProductDO';

export interface IPriceProductYieldStrategy {
	yield(priceProduct: PriceProductDO, interval: ThDateIntervalDO): PriceProductDO;
}