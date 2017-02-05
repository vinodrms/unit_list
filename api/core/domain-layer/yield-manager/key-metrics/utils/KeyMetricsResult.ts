import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { ThUtils } from '../../../../utils/ThUtils';
import { KeyMetricType } from './KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from './values/IKeyMetricValue';

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