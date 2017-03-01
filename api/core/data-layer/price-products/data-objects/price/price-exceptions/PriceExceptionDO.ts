import { BaseDO } from '../../../../common/base/BaseDO';
import { ISOWeekDay } from '../../../../../utils/th-dates/data-objects/ISOWeekDay';
import { IPriceProductPrice } from '../IPriceProductPrice';

export class PriceExceptionDO extends BaseDO {
    roomCategoryId: string;
    dayFromWeek: ISOWeekDay;
    price: IPriceProductPrice;

    protected getPrimitivePropertyKeys(): string[] {
        return ["roomCategoryId", "dayFromWeek"];
    }
}