import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { KeyMetric } from '../KeyMetricsResult';

export interface IMetricBuilderStrategy {
    buildKeyMetric(thDateList: ThDateDO[]): KeyMetric;
}