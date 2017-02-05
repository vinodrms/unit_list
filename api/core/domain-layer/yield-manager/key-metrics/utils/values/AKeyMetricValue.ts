import { IKeyMetricValue } from './IKeyMetricValue';
import { ThPeriodType } from '../../../../reports/key-metrics/period-converter/ThPeriodDO';

export abstract class AKeyMetricValue implements IKeyMetricValue {
    protected _noValues = 0;

    constructor() {
        this._noValues = 1;
    }

    public abstract getDisplayValue(periodType: ThPeriodType): string;

    public add(value: IKeyMetricValue) {
        this._noValues++;
        this.addCore(value);
    }
    protected abstract addCore(value: IKeyMetricValue);
}