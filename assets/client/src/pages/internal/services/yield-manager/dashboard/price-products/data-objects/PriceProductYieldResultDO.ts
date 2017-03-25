import { BaseDO } from '../../../../../../../common/base/BaseDO';
import { ThDateDO } from '../../../../common/data-objects/th-dates/ThDateDO';
import { PriceProductYieldItemDO } from './PriceProductYieldItemDO';

export class PriceProductYieldResultDO extends BaseDO {
    dateList: ThDateDO[];
    itemList: PriceProductYieldItemDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.dateList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "dateList"), (dateObject: Object) => {
            var thDate = new ThDateDO();
            thDate.buildFromObject(dateObject);
            this.dateList.push(thDate);
        });

        this.itemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "itemList"), (yieldItemObject: Object) => {
            var yieldItem = new PriceProductYieldItemDO();
            yieldItem.buildFromObject(yieldItemObject);
            this.itemList.push(yieldItem);
        });
    }
}