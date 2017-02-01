import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { KeyMetricType } from './KeyMetricType';

export class PriceKeyMetric implements IKeyMetricValue {
    price: number;
    public getDisplayValue(): string {
        return this.price.toString();
    }
}
export class PercentageKeyMetric implements IKeyMetricValue {
    percentage: number;
    public getDisplayValue(): string {
        return (this.percentage * 100.0).toString() + "%";
    }
}
export class InventoryKeyMetric implements IKeyMetricValue {
    total: number;
    available: number;
    public getDisplayValue(): string {
        return (this.total - this.available).toString() + " of " + this.total;
    }
}
export interface IKeyMetricValue {
    getDisplayValue(): string;
}

export enum KeyMetricValueType {
    Price,
    Percentage,
    Inventory
}

export class KeyMetric {
    type: KeyMetricType;
    valueType: KeyMetricValueType;
    valueList: IKeyMetricValue[];
    displayName: string;
}

export class KeyMetricsResultItem {
    interval: ThDateIntervalDO;
    dateList: ThDateDO[];
    metricList: KeyMetric[];
}

export class KeyMetricsResult {
    currentItem: KeyMetricsResultItem;
    previousItem: KeyMetricsResultItem;
}