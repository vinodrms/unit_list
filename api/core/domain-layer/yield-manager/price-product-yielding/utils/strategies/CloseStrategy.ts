import {AYieldStrategy} from './AYieldStrategy';
import {PriceProductDO} from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';

export class CloseStrategy extends AYieldStrategy {
	public yield(priceProduct: PriceProductDO, interval: ThDateIntervalDO): PriceProductDO {
		priceProduct.openIntervalList = this.removeInterval(priceProduct.openIntervalList, interval);
		return priceProduct;
	}
}