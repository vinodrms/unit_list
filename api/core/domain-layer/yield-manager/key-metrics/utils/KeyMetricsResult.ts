import {ThDateIntervalDO} from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';
import {KeyMetricType} from './KeyMetricType';

export class PriceKeyMetric implements IKeyMetricValue {
    price: number;
}
export class PercentageKeyMetric implements IKeyMetricValue {
    percentage: number;
}
export class InventoryKeyMetric implements IKeyMetricValue {
    total: number;
    available: number;
}
export interface IKeyMetricValue {
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