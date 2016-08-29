import {BaseDO} from '../../../../../../../../common/base/BaseDO';
import {IKeyMetricValue} from './IKeyMetricValue';

export class InventoryKeyMetricDO extends BaseDO implements IKeyMetricValue {
    total: number;
    available: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["total", "available"];
    }
    public getValue(): number {
        return this.available;
    }
}