import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThUtils} from '../../../../../../common/utils/ThUtils';

import * as _ from "underscore";

export class BookingPriceItemDO extends BaseDO {
    roomCategoryId: string;
    price: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["roomCategoryId", "price"];
    }
}

export class BookingPossiblePriceItemsDO extends BaseDO {
    private _thUtils: ThUtils;

    priceItemList: BookingPriceItemDO[];

    constructor() {
        super();
        this._thUtils = new ThUtils();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.priceItemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceItemList"), (priceItemObject: Object) => {
            var bookingPriceItem = new BookingPriceItemDO();
            bookingPriceItem.buildFromObject(priceItemObject);
            this.priceItemList.push(bookingPriceItem);
        });
    }

    public constrainsPriceFor(roomCategoryId: string): boolean {
        var priceItem: BookingPriceItemDO = this.getPriceItemFor(roomCategoryId);
        return !this._thUtils.isUndefinedOrNull(priceItem);
    }
    public getPriceItemFor(roomCategoryId: string): BookingPriceItemDO {
        return _.find(this.priceItemList, (priceItem: BookingPriceItemDO) => {
            return priceItem.roomCategoryId === roomCategoryId;
        });
    }
}