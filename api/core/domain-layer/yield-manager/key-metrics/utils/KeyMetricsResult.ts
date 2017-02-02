import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { ThUtils } from '../../../../utils/ThUtils';
import { KeyMetricType } from './KeyMetricType';

export class PriceKeyMetric implements IKeyMetricValue {
    price: number;
    public getDisplayValue(): string {
        return this.price.toString();
    }
    public add(value: any) {
        this.price += value.price;
    }
    public divideBy(divisor: number) {
        let thUtils = new ThUtils();
        this.price = thUtils.roundNumberToTwoDecimals(this.price / divisor);
    }
}
export class PercentageKeyMetric implements IKeyMetricValue {
    percentage: number;
    public getDisplayValue(): string {
        return (this.percentage * 100.0).toString() + "%";
    }
    public add(value: any) {
        this.percentage += value.percentage;
    }
    public divideBy(divisor: number) {
        let thUtils = new ThUtils();
        this.percentage = thUtils.roundNumberToTwoDecimals(this.percentage / divisor);
    }
}
export class InventoryKeyMetric implements IKeyMetricValue {
    total: number;
    available: number;
    public getDisplayValue(): string {
        let thUtils = new ThUtils();
        return thUtils.roundNumberToTwoDecimals(this.total - this.available).toString() + " of " + this.total;
    }
    public add(value: any) {
        this.total += value.total;
        this.available += value.available;
    }
    public divideBy(divisor: number) {
        let thUtils = new ThUtils();
        this.total = thUtils.roundNumberToTwoDecimals(this.total / divisor);
        this.available = thUtils.roundNumberToTwoDecimals(this.available / divisor);
    }
}
export interface IKeyMetricValue {
    getDisplayValue(): string;
    add(value: IKeyMetricValue);
    divideBy(divisor: number);
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