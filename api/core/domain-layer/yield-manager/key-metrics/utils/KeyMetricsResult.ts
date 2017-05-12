import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { ThUtils } from '../../../../utils/ThUtils';
import { KeyMetricType } from './KeyMetricType';
import { IKeyMetricValue, KeyMetricValueType } from './values/IKeyMetricValue';
import { ThPeriodDO } from "../../../reports/key-metrics/period-converter/ThPeriodDO";

export interface IKeyMetricValueGroup {
	period: ThPeriodDO;
	metricValue?: IKeyMetricValue;
}

export class KeyMetric {
    type: KeyMetricType;
    valueType: KeyMetricValueType;
    valueList: IKeyMetricValue[];
    aggregatedValueList: IKeyMetricValueGroup[];
    displayName: string;
}

export class KeyMetricsResultItem {
    interval: ThDateIntervalDO;
    dateList: ThDateDO[];
    aggregationPeriodList: ThPeriodDO[];
    metricList: KeyMetric[];
}

export class KeyMetricsResult {
    currentItem: KeyMetricsResultItem;
    previousItem: KeyMetricsResultItem;
}