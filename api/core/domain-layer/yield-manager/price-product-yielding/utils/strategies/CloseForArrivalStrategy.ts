import {AYieldStrategy} from './AYieldStrategy';
import {PriceProductDO} from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';

export class CloseForArrivalStrategy extends AYieldStrategy {
    public yield(priceProduct: PriceProductDO, interval: ThDateIntervalDO): PriceProductDO {
        priceProduct.openForArrivalIntervalList = this.removeInterval(priceProduct.openForArrivalIntervalList, interval);
        return priceProduct;
    }
}