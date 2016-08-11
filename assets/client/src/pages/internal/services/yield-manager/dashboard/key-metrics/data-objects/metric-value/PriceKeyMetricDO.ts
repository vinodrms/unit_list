import {BaseDO} from '../../../../../../../../common/base/BaseDO';
import {IKeyMetricValue} from './IKeyMetricValue';

export class PriceKeyMetricDO extends BaseDO implements IKeyMetricValue {
    price: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["price"];
    }

    public getValue(): number {
        return this.price;
    }
}