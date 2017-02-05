import { ThUtils } from '../../../../../utils/ThUtils';
import { IKeyMetricValue } from './IKeyMetricValue';
import { AKeyMetricValue } from './AKeyMetricValue';
import { ThPeriodType } from '../../../../reports/key-metrics/period-converter/ThPeriodDO';

export interface PriceKeyMetricOptions {
    computeAverageForMultipleValues: boolean;
}

export class PriceKeyMetric extends AKeyMetricValue {
    price: number;

    constructor(private _options: PriceKeyMetricOptions) {
        super();
    }

    public getDisplayValue(periodType: ThPeriodType): string {
        if (this._noValues > 1 && this._options.computeAverageForMultipleValues) {
            let thUtils = new ThUtils();
            let avgPrice = thUtils.roundNumberToNearestInteger(this.price / this._noValues);
            return avgPrice.toString();
        }
        return this.price.toString();
    }

    protected addCore(value: any) {
        this.price += value.price;
    }
}