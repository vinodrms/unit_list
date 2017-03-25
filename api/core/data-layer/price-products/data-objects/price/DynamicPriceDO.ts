import { BaseDO } from '../../../common/base/BaseDO';
import { IPriceProductPrice, PriceProductPriceType, PriceProductPriceQueryDO } from "./IPriceProductPrice";
import { PriceExceptionDO } from "./price-exceptions/PriceExceptionDO";
import { SinglePriceDO } from "./single-price/SinglePriceDO";
import { PricePerPersonDO } from "./price-per-person/PricePerPersonDO";
import { ISOWeekDay } from "../../../../utils/th-dates/data-objects/ISOWeekDay";
import { ThUtils } from "../../../../utils/ThUtils";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { RoomCategoryStatsDO } from "../../../room-categories/data-objects/RoomCategoryStatsDO";

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

    public hasPriceConfiguredFor(query: PriceProductPriceQueryDO): boolean {
        var priceItem: IPriceProductPrice = this.getPriceForRoomCategory(query.roomCategoryId);
        if (!priceItem) {
            return false;
        }
        return priceItem.hasPriceConfiguredFor(query);
    }
    public getRoomCategoryIdList(): string[] {
        return _.map(this.priceList, price => { return price.getRoomCategoryId(); });
    }
    public getPriceForRoomCategory(roomCategoryId: string): IPriceProductPrice {
        return _.find(this.priceList, (price: IPriceProductPrice) => { return price.getRoomCategoryId() === roomCategoryId; });
    }

    public getPriceForDate(query: PriceProductPriceQueryDO, thDate: ThDateDO): number {
        let thUtils = new ThUtils();
        let exception = this.getPriceException(query.roomCategoryId, thDate.getISOWeekDay());
        if (!thUtils.isUndefinedOrNull(exception)) {
            return exception.price.getPricePerNightFor(query);
        }
        else {
            let priceItem: IPriceProductPrice = this.getPriceForRoomCategory(query.roomCategoryId);
            return priceItem.getPricePerNightFor(query);
        }
    }
    private getPriceException(roomCategoryId: string, dayOfWeek: ISOWeekDay): PriceExceptionDO {
        return _.find(this.priceExceptionList, priceException => {
            return priceException.getRoomCategoryId() === roomCategoryId &&
                priceException.dayFromWeek === dayOfWeek;
        });
    }

    public priceConfigurationIsValidFor(roomCategoryStatList: RoomCategoryStatsDO[]): boolean {
        var isValid = true;
        roomCategoryStatList.forEach((roomCategoryStat: RoomCategoryStatsDO) => {
            if (!this.priceConfigurationIsValidForSingleRoomCategoryId(roomCategoryStatList, roomCategoryStat.roomCategory.id)) {
                isValid = false;
            }
        });
        return isValid;
    }
    private priceConfigurationIsValidForSingleRoomCategoryId(roomCategoryStatList: RoomCategoryStatsDO[], roomCategoryId: string): boolean {
        var thUtils = new ThUtils();
        var priceItem: IPriceProductPrice = this.getPriceForRoomCategory(roomCategoryId);
        if (thUtils.isUndefinedOrNull(priceItem)) {
            return false;
        }
        return priceItem.priceConfigurationIsValidFor(roomCategoryStatList);
    }

    public roundPricesToTwoDecimals() {
        _.forEach(this.priceList, (price: IPriceProductPrice) => {
            price.roundPricesToTwoDecimals();
        });
    }
}