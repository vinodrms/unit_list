import {AYieldStrategy} from './AYieldStrategy';
import {PriceProductDO} from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';

export class CloseForDepartureStrategy extends AYieldStrategy {
    public yield(priceProduct: PriceProductDO, interval: ThDateIntervalDO): PriceProductDO {
        priceProduct.openForDepartureIntervalList = this.removeInterval(priceProduct.openForDepartureIntervalList, interval);
        return priceProduct;
    }
}