import { IPriceProductPrice, PriceProductPriceType } from "./IPriceProductPrice";
import { PriceExceptionDO } from "./price-exceptions/PriceExceptionDO";
import { SinglePriceDO } from "./single-price/SinglePriceDO";
import { PricePerPersonDO } from "./price-per-person/PricePerPersonDO";
import { RoomCategoryStatsDO } from "../../../room-categories/data-objects/RoomCategoryStatsDO";
import { BaseDO } from "../../../../../../common/base/BaseDO";
import { ISOWeekDay } from "../../../common/data-objects/th-dates/ISOWeekDay";
import { ThUtils } from "../../../../../../common/utils/ThUtils";

export class DynamicPriceDO extends BaseDO {
    id: string;
    name: string;
    description: string;
    priceList: IPriceProductPrice[];
    priceExceptionList: PriceExceptionDO[];

    constructor(private _type: PriceProductPriceType) {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "name", "description"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.priceList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceList"), (priceObject: Object) => {
            var price: IPriceProductPrice = this.buildPriceInstance(this._type);
            price.buildFromObject(priceObject);
            this.priceList.push(price);
        });

        this.priceExceptionList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceExceptionList"), (priceExceptionObject: Object) => {
            let priceException = new PriceExceptionDO();
            priceException.buildFromObject(priceExceptionObject);
            priceException.price = this.buildPriceInstance(this._type);
            priceException.price.buildFromObject(this.getObjectPropertyEnsureUndefined(priceExceptionObject, "price"));
            this.priceExceptionList.push(priceException);
        });
    }
    private buildPriceInstance(type: PriceProductPriceType): IPriceProductPrice {
        if (type === PriceProductPriceType.SinglePrice) {
            return new SinglePriceDO();
        }
        return new PricePerPersonDO();
    }

    public getRoomCategoryIdList(): string[] {
        return _.map(this.priceList, price => { return price.getRoomCategoryId(); });
    }
    public getPriceForRoomCategory(roomCategoryId: string): IPriceProductPrice {
        return _.find(this.priceList, (price: IPriceProductPrice) => { return price.getRoomCategoryId() === roomCategoryId; });
    }

    private getPriceException(roomCategoryId: string, dayOfWeek: ISOWeekDay): PriceExceptionDO {
        return _.find(this.priceExceptionList, priceException => {
            return priceException.getRoomCategoryId() === roomCategoryId &&
                priceException.dayFromWeek === dayOfWeek;
        });
    }
    
    public getFilteredExceptionsByRoomCategoryId(roomCategoryId: string): PriceExceptionDO[] {
		return _.filter(this.priceExceptionList, exp => {
			return exp.getRoomCategoryId() === roomCategoryId;
		});
	}

    public get type(): PriceProductPriceType {
        return this._type;
    }
}