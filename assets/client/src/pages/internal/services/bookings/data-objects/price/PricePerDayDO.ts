import { BaseDO } from '../../../../../../common/base/BaseDO';
import { ThDateDO } from '../../../common/data-objects/th-dates/ThDateDO';

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
}