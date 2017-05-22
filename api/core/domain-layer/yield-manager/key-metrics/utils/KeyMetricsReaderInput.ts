import { ThPeriodType } from "../../../reports/key-metrics/period-converter/ThPeriodDO";
import { YieldManagerPeriodDO } from "../../utils/YieldManagerPeriodDO";

export class KeyMetricsReaderInput {
    yieldManagerPeriodDO: YieldManagerPeriodDO;
    includePreviousPeriod: boolean;
    dataAggregationType: ThPeriodType;
    excludeCommission: boolean;
    excludeVat: boolean;
}