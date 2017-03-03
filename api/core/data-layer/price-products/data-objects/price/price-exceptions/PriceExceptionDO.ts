import { BaseDO } from '../../../../common/base/BaseDO';
import { ISOWeekDay } from '../../../../../utils/th-dates/data-objects/ISOWeekDay';
import { IPriceProductPrice } from '../IPriceProductPrice';

export class PriceExceptionDO extends BaseDO {
    dayFromWeek: ISOWeekDay;
    price: IPriceProductPrice;

    protected getPrimitivePropertyKeys(): string[] {
        return ["dayFromWeek"];
    }

    public getRoomCategoryId(): string {
        return this.price.getRoomCategoryId();
    }
}