import { BaseDO } from '../../../../../../../../../../../common/base/BaseDO';
import { ThDateDO } from '../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';

export class PricePerDayDO extends BaseDO {
    dynamicPriceId: string;
    thDate: ThDateDO;
    price: number;
    discount: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["dynamicPriceId", "price", "discount"];
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