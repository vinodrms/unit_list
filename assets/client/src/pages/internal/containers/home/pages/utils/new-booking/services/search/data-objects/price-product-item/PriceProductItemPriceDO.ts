import {BaseDO} from '../../../../../../../../../../../common/base/BaseDO';
import {PricePerDayDO} from './PricePerDayDO';

export class PriceProductItemPriceDO extends BaseDO {
    constructor() {
        super();
    }

    roomCategoryId: string;
    price: number;
    pricePerDayList: PricePerDayDO[];
    commision: number;
    otherPrice: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["roomCategoryId", "price", "commision", "otherPrice"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.pricePerDayList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "pricePerDayList"), (pricePerDayObject: Object) => {
            var pricePerDayDO = new PricePerDayDO();
            pricePerDayDO.buildFromObject(pricePerDayObject);
            this.pricePerDayList.push(pricePerDayDO);
        });
    }
}