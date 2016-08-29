import {AYieldStrategy} from './AYieldStrategy';
import {PriceProductDO} from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';

export class OpenForDepartureStrategy extends AYieldStrategy {
    public yield(priceProduct: PriceProductDO, interval: ThDateIntervalDO): PriceProductDO {
        priceProduct.openForDepartureIntervalList = this.addInterval(priceProduct.openForDepartureIntervalList, interval);
        return priceProduct;
    }
}