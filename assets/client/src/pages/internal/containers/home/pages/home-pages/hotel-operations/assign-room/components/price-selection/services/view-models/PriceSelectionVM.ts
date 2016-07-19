import {RoomCategoryStatsDO} from '../../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import {CurrencyDO} from '../../../../../../../../../../services/common/data-objects/currency/CurrencyDO';

export class PriceSelectionVM {
    private _roomCategoryStats: RoomCategoryStatsDO;
    private _price: number;
    private _ccy: CurrencyDO;
    private _description: string;

    public get roomCategoryStats(): RoomCategoryStatsDO {
        return this._roomCategoryStats;
    }
    public set roomCategoryStats(roomCategoryStats: RoomCategoryStatsDO) {
        this._roomCategoryStats = roomCategoryStats;
    }
    public get price(): number {
        return this._price;
    }
    public set price(price: number) {
        this._price = price;
    }
    public get ccy(): CurrencyDO {
        return this._ccy;
    }
    public set ccy(ccy: CurrencyDO) {
        this._ccy = ccy;
    }
    public get description(): string {
        return this._description;
    }
    public set description(description: string) {
        this._description = description;
    }

    public get priceText(): string {
        return this._price + this._ccy.nativeSymbol;;
    }
    public get roomCategoryName(): string {
        return this._roomCategoryStats.roomCategory.displayName;
    }
}