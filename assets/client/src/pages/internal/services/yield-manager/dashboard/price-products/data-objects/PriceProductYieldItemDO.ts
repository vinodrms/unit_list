import { BaseDO } from '../../../../../../../common/base/BaseDO';
import { YieldItemStateDO } from './YieldItemStateDO';
import { PriceProductYieldFilterMetaDO } from '../../../../price-products/data-objects/yield-filter/PriceProductYieldFilterDO';
import { DynamicPriceYieldItemDO } from './DynamicPriceYieldItemDO';

export class PriceProductYieldItemDO extends BaseDO {
    priceProductId: string;
    priceProductName: string;
    lastRoomAvailability: boolean;
    yieldFilterList: PriceProductYieldFilterMetaDO[];
    stateList: YieldItemStateDO[];
    dynamicPriceList: DynamicPriceYieldItemDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["priceProductId", "priceProductName", "lastRoomAvailability"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.yieldFilterList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "yieldFilterList"), (yieldFilterObject: Object) => {
            var filterMeta = new PriceProductYieldFilterMetaDO();
            filterMeta.buildFromObject(yieldFilterObject);
            this.yieldFilterList.push(filterMeta);
        });

        this.stateList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "stateList"), (stateObject: Object) => {
            var itemState = new YieldItemStateDO();
            itemState.buildFromObject(stateObject);
            this.stateList.push(itemState);
        });

        this.dynamicPriceList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "dynamicPriceList"), (dynamicPriceObject: Object) => {
            var dynamicPrice = new DynamicPriceYieldItemDO();
            dynamicPrice.buildFromObject(dynamicPriceObject);
            this.dynamicPriceList.push(dynamicPrice);
        });
    }
}