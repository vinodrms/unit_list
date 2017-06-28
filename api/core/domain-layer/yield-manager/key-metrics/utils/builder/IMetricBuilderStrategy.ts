import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { KeyMetric } from '../KeyMetricsResult';
import { ThPeriodDO } from "../../../../reports/key-metrics/period-converter/ThPeriodDO";
import { BookingSegment } from "../../../../hotel-inventory-snapshots/stats-reader/data-objects/utils/BookingSegment";

export interface IMetricBuilderInput {
    excludeCommission?: boolean;
    revenueSegment?: BookingSegment;
}

export interface IMetricBuilderStrategy {
    buildKeyMetric(thDateList: ThDateDO[], aggregationPeriodList: ThPeriodDO[]): KeyMetric;
}