import { ThUtils } from '../../../../../utils/ThUtils';
import { IKeyMetricValue } from './IKeyMetricValue';
import { AKeyMetricValue } from './AKeyMetricValue';
import { ThPeriodType } from '../../../../reports/key-metrics/period-converter/ThPeriodDO';

export class CounterKeyMetric extends AKeyMetricValue {
    total: number;

    constructor() {
        super();
    }

    public getDisplayValue(periodType: ThPeriodType): string {
        return this.total.toString();
    }
}