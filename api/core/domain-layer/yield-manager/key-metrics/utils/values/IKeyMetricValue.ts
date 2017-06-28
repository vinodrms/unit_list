import { ThPeriodType } from '../../../../reports/key-metrics/period-converter/ThPeriodDO';

export enum KeyMetricValueType {
    Price,
    Percentage,
    Inventory,
    Counter,
    
}

export interface IKeyMetricValue {
    getDisplayValue(periodType: ThPeriodType): string;
}