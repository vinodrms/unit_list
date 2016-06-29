import {BaseDO} from '../../../../../../../../../../../common/base/BaseDO';
import {PriceProductItemPriceDO} from './PriceProductItemPriceDO';
import {PriceProductDO} from '../../../../../../../../../services/price-products/data-objects/PriceProductDO';

export class PriceProductItemDO extends BaseDO {
    constructor() {
        super();
    }

    priceProduct: PriceProductDO;
    priceList: PriceProductItemPriceDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.priceProduct = new PriceProductDO();
        this.priceProduct.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "priceProduct"));

        this.priceList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceList"), (priceObject: Object) => {
            var priceItemDO = new PriceProductItemPriceDO();
            priceItemDO.buildFromObject(priceObject);
            this.priceList.push(priceItemDO);
        });
    }

    public getPriceForRoomCategory(roomCategoryId: string): number {
        var price = _.find(this.priceList, (priceItem: PriceProductItemPriceDO) => { return priceItem.roomCategoryId === roomCategoryId });
        if(!price) {
            return 0.0;
        }
        return price.price;
    }
}