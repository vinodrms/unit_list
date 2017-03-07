import { BaseDO } from '../../../common/base/BaseDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';

export class PricePerDayDO extends BaseDO {
    thDate: ThDateDO;
    price: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["price"];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.thDate = new ThDateDO();
        this.thDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "thDate"));
    }

    public static buildPricePerDayList(thDateList: ThDateDO[], priceList: number[]): PricePerDayDO[] {
        let pricePerDayList: PricePerDayDO[] = [];
        let length = Math.min(thDateList.length, priceList.length);
        for (var i = 0; i < length; i++) {
            let pricePerDay = new PricePerDayDO();
            pricePerDay.thDate = thDateList[i];
            pricePerDay.price = priceList[i];
            pricePerDayList.push(pricePerDay);
        }
        return pricePerDayList;
    }
}