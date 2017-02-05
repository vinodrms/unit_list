import { ThUtils } from '../../../../../utils/ThUtils';
import { IKeyMetricValue } from './IKeyMetricValue';
import { AKeyMetricValue } from './AKeyMetricValue';
import { ThPeriodType } from '../../../../reports/key-metrics/period-converter/ThPeriodDO';

export class InventoryKeyMetric extends AKeyMetricValue {
    total: number;
    available: number;

    public getDisplayValue(periodType: ThPeriodType): string {
        let thUtils = new ThUtils();
        if (this._noValues == 1 && periodType == ThPeriodType.Day) {
            return thUtils.roundNumberToNearestInteger(this.available).toString() + " of " + this.total;
        }
        return thUtils.roundNumberToNearestInteger(this.total - this.available).toString();
    }

    protected addCore(value: any) {
        this.total += value.total;
        this.available += value.available;
    }
}