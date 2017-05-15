import { ThUtils } from '../../../../../utils/ThUtils';
import { IKeyMetricValue } from './IKeyMetricValue';
import { AKeyMetricValue } from './AKeyMetricValue';
import { ThPeriodType } from '../../../../reports/key-metrics/period-converter/ThPeriodDO';

export class PercentageKeyMetric extends AKeyMetricValue {
    percentage: number;

    public getDisplayValue(periodType: ThPeriodType): string {
        let thUtils = new ThUtils();
        let actualPercentage = this.percentage * 100.0;
        return thUtils.roundNumberToNearestInteger(actualPercentage).toString() + "%";
    }
}