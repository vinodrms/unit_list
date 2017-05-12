import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { KeyMetric } from '../KeyMetricsResult';
import { ThPeriodDO } from "../../../../reports/key-metrics/period-converter/ThPeriodDO";

export interface IMetricBuilderStrategy {
    buildKeyMetric(thDateList: ThDateDO[], aggregationPeriodList: ThPeriodDO[]): KeyMetric;
}