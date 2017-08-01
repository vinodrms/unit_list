import { RoomCategoryStatsDO } from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { PriceProductPriceType, IPriceProductPrice } from '../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import { PriceExceptionDO } from '../../../../../../../../../services/price-products/data-objects/price/price-exceptions/PriceExceptionDO';
import { PriceProductPriceDO } from '../../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO';
import { ISOWeekDay } from '../../../../../../../../../services/common/data-objects/th-dates/ISOWeekDay';

import * as _ from "underscore";

export class PriceVM {
    private _roomCategoryStats: RoomCategoryStatsDO;
    private _priceType: PriceProductPriceType;
    private _price: IPriceProductPrice;
    private _priceExceptionsByWeekday: { [index: number]: IPriceProductPrice };
    private _exceptionList: PriceExceptionDO[];

    constructor(priceType: PriceProductPriceType) {
        this._priceType = priceType;
        this._exceptionList = [];
        this._priceExceptionsByWeekday = {};
    }

    public get roomCategoryStats(): RoomCategoryStatsDO {
        return this._roomCategoryStats;
    }
    public set roomCategoryStats(roomCategoryStats: RoomCategoryStatsDO) {
        this._roomCategoryStats = roomCategoryStats;
    }

    public get priceType(): PriceProductPriceType {
        return this._priceType;
    }
    public set priceType(priceType: PriceProductPriceType) {
        this._priceType = priceType;
    }

    public get price(): IPriceProductPrice {
        return this._price;
    }
    public set price(price: IPriceProductPrice) {
        this._price = price;
    }

    public get priceExceptionsByWeekday(): { [index: number]: IPriceProductPrice } {
        return this._priceExceptionsByWeekday;
    }
    public set priceExceptionsByWeekday(priceExceptionsByWeekday: { [index: number]: IPriceProductPrice }) {
        this._priceExceptionsByWeekday = priceExceptionsByWeekday;
    }

    public get exceptionList(): PriceExceptionDO[] {
        return this._exceptionList;
    }
    public set exceptionList(exceptionList: PriceExceptionDO[]) {
        this._exceptionList = exceptionList;
    }

    public isValid(): boolean {
        if (!this._price.isValid()) { return false; }
        var valid = true;
        let weekDayList = Object.keys(this._priceExceptionsByWeekday);
        _.forEach(weekDayList, weekDay => {
            let price: IPriceProductPrice = this._priceExceptionsByWeekday[weekDay];
            if (!price.isValid()) {
                valid = false;
            }
        });
        return valid;
    }

    public indexExceptions() {
        let exceptionList: PriceExceptionDO[] = [];
        let weekDayList = Object.keys(this._priceExceptionsByWeekday);
        _.forEach(weekDayList, weekDay => {
            let exception = new PriceExceptionDO();
            exception.dayFromWeek = parseInt(weekDay);
            exception.price = this._priceExceptionsByWeekday[weekDay];
            exceptionList.push(exception);
        });
        this._exceptionList = exceptionList;
    }

    public deleteExceptionOn(dayFromWeek: ISOWeekDay) {
        delete this.priceExceptionsByWeekday[dayFromWeek];
        this.indexExceptions();
    }
    public hasExceptions(): boolean {
        return this.exceptionList.length > 0;
    }
    public buildPrototype(): PriceVM {
        let priceCopy: PriceVM = new PriceVM(this.priceType);
        priceCopy.price = PriceProductPriceDO.buildPriceInstance(this.priceType);
        priceCopy.price.buildFromObject(this.price);
        this.exceptionList.forEach(e => {
            let exceptionPrice = PriceProductPriceDO.buildPriceInstance(this.priceType);
            exceptionPrice.buildFromObject(e.price);
            priceCopy.priceExceptionsByWeekday[e.dayFromWeek] = exceptionPrice;
        });
        priceCopy.indexExceptions();
        priceCopy.roomCategoryStats = this.roomCategoryStats;
        return priceCopy;
    }
}