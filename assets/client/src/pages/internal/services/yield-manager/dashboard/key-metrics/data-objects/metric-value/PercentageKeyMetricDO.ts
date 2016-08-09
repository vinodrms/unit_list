import {BaseDO} from '../../../../../../../../common/base/BaseDO';
import {IKeyMetricValue} from './IKeyMetricValue';

export class PercentageKeyMetricDO extends BaseDO implements IKeyMetricValue {
    percentage: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["percentage"];
    }
}