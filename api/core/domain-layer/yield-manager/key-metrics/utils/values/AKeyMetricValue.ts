import { IKeyMetricValue } from './IKeyMetricValue';
import { ThPeriodType } from '../../../../reports/key-metrics/period-converter/ThPeriodDO';

export abstract class AKeyMetricValue implements IKeyMetricValue {
    constructor() {
    }

    public abstract getDisplayValue(periodType: ThPeriodType): string;
}