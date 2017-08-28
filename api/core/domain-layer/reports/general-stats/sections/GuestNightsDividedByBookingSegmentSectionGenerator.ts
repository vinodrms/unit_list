import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { KeyMetricType } from "../../../yield-manager/key-metrics/utils/KeyMetricType";
import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { KeyMetricsResultItem, KeyMetric } from "../../../yield-manager/key-metrics/utils/KeyMetricsResult";
import { ThPeriodType } from "../../key-metrics/period-converter/ThPeriodDO";
import { ReportSectionMeta, ReportSectionHeader } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";

import _ = require('underscore');

export class GuestNightsDividedByBookingSegmentSectionGenerator extends AReportSectionGeneratorStrategy {
    private static KeyMetricList = [KeyMetricType.GuestNightsByBookingSegment];

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _periodType: ThPeriodType, private _kmResultItem: KeyMetricsResultItem, private _reportSectionHeader: ReportSectionHeader) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Guest Nights by Purpose of Stay"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return {
        }
    }

    protected getHeader(): ReportSectionHeader {
        return this._reportSectionHeader;
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        var data: any[] = [];
        _.filter(this._kmResultItem.metricList, (metric: KeyMetric) => {
            return _.contains(GuestNightsDividedByBookingSegmentSectionGenerator.KeyMetricList, metric.type);
        }).forEach((metric: KeyMetric) => {
            let typeStr = this._appContext.thTranslate.translate(metric.displayName);
            let row: any = [typeStr];
            for (var i = 0; i < metric.aggregatedValueList.length; i++) {
                row.push(metric.aggregatedValueList[i].metricValue.getDisplayValue(this._periodType));
            }
            data.push(row);
            row = [];
        });

        resolve(data);
    }
}