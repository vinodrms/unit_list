import { ThPeriodType } from "../../../reports/key-metrics/period-converter/ThPeriodDO";
import { YieldManagerPeriodDO } from "../../utils/YieldManagerPeriodDO";

export enum CommissionOption {
    INCLUDE,
    EXCLUDE,
    BOTH,
    INCLUDE_AND_BOTH_FOR_ROOM_REVENUE
}

export var CommissionOptionDisplayNames: { [index: number]: string; } = {};
CommissionOptionDisplayNames[CommissionOption.INCLUDE] = "Include Deducted Commission";
CommissionOptionDisplayNames[CommissionOption.EXCLUDE] = "Exclude Deducted Commission";
CommissionOptionDisplayNames[CommissionOption.BOTH] = "W/ and W/O Deducted Commission";
CommissionOptionDisplayNames[CommissionOption.INCLUDE_AND_BOTH_FOR_ROOM_REVENUE] = "Include Deducted Commission"; 


export class KeyMetricsReaderInput {
    yieldManagerPeriodDO: YieldManagerPeriodDO;
    includePreviousPeriod: boolean;
    dataAggregationType: ThPeriodType;
    commissionOption: CommissionOption;
    excludeVat: boolean;
    customerIdList: string[];
}