import {BaseDO} from '../../../../../../../../../../../common/base/BaseDO';

export class PriceProductItemPriceDO extends BaseDO {
    constructor() {
        super();
    }

    roomCategoryId: string;
    price: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["roomCategoryId", "price"];
    }
}