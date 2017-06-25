import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { KeyMetric } from '../KeyMetricsResult';
import { ThPeriodDO } from "../../../../reports/key-metrics/period-converter/ThPeriodDO";
import { RevenueSegment } from "../../../../hotel-inventory-snapshots/stats-reader/data-objects/revenue/ISegmentedRevenueForDate";

export interface IMetricBuilderInput {
    excludeCommission?: boolean;
    revenueSegment?: RevenueSegment;
}

export interface IMetricBuilderStrategy {
    buildKeyMetric(thDateList: ThDateDO[], aggregationPeriodList: ThPeriodDO[]): KeyMetric;
}