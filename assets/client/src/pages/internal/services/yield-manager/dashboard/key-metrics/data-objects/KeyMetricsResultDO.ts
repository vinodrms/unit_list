import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {KeyMetricsResultItemDO} from './result-item/KeyMetricsResultItemDO';

export class KeyMetricsResultDO extends BaseDO {
    currentItem: KeyMetricsResultItemDO;
    previousItem: KeyMetricsResultItemDO;

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.currentItem = new KeyMetricsResultItemDO();
        this.currentItem.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "currentItem"));

        this.previousItem = new KeyMetricsResultItemDO();
        this.previousItem.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "previousItem"));
    }
}