import { RoomCategoryStatsDO } from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { PriceProductPriceType, IPriceProductPrice } from '../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import { PriceExceptionDO } from '../../../../../../../../../services/price-products/data-objects/price/price-exceptions/PriceExceptionDO';
import { ISOWeekDay } from '../../../../../../../../../services/common/data-objects/th-dates/ISOWeekDay';

export class PriceVM {
    private _roomCategoryStats: RoomCategoryStatsDO;
    private _previousRoomCategoryId: string;
    private _priceType: PriceProductPriceType;
    private _price: IPriceProductPrice;
    private _priceExceptionsByWeekday: { [index: number]: IPriceProductPrice };
    private _exceptionList: PriceExceptionDO[];

    constructor(priceType: PriceProductPriceType) {
        this._priceType = priceType;
        this._priceExceptionsByWeekday = {};
    }

    public get roomCategoryStats(): RoomCategoryStatsDO {
        return this._roomCategoryStats;
    }
    public set roomCategoryStats(roomCategoryStats: RoomCategoryStatsDO) {
        this._roomCategoryStats = roomCategoryStats;
    }

    public get previousRoomCategoryId(): string {
        return this._previousRoomCategoryId;
    }
    public set previousRoomCategoryId(previousRoomCategoryId: string) {
        this._previousRoomCategoryId = previousRoomCategoryId;
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
}