import {IPriceProductYieldStrategy} from '../IPriceProductYieldStrategy';
import {PriceProductDO} from '../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateIntervalUtils} from '../../../../../utils/th-dates/ThDateIntervalUtils';

export abstract class AYieldStrategy implements IPriceProductYieldStrategy {
    public abstract yield(priceProduct: PriceProductDO, interval: ThDateIntervalDO): PriceProductDO;

    protected removeInterval(intervalList: ThDateIntervalDO[], intervalToRemove: ThDateIntervalDO): ThDateIntervalDO[] {
        var intervalUtils = new ThDateIntervalUtils(intervalList);
        intervalUtils.removeInterval(intervalToRemove);
        return <ThDateIntervalDO[]>intervalUtils.getProcessedIntervals();
    }

    protected addInterval(intervalList: ThDateIntervalDO[], intervalToAdd: ThDateIntervalDO): ThDateIntervalDO[] {
        var intervalUtils = new ThDateIntervalUtils(intervalList);
        intervalUtils.addInterval(intervalToAdd);
        return <ThDateIntervalDO[]>intervalUtils.getProcessedIntervals();
    }
}