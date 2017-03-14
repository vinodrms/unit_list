import { BaseDO } from '../../../common/base/BaseDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { INumber } from "../../../../utils/ThUtils";

export class PricePerDayDO extends BaseDO implements INumber {
    dynamicPriceId: string;
    thDate: ThDateDO;
    price: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["dynamicPriceId", "price"];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.thDate = new ThDateDO();
        this.thDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "thDate"));
    }

    public getValue(): number {
        return this.price;
    }
}