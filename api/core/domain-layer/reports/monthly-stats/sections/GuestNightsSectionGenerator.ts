
import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { ReportSectionMeta, ReportSectionHeader } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { KeyMetricsResultItem, KeyMetric, IKeyMetricValueGroup } from "../../../yield-manager/key-metrics/utils/KeyMetricsResult";
import { KeyMetricType } from "../../../yield-manager/key-metrics/utils/KeyMetricType";
import { ThPeriodDO, ThPeriodType } from "../../key-metrics/period-converter/ThPeriodDO";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { ThDateToThPeriodConverterFactory } from "../../key-metrics/period-converter/ThDateToThPeriodConverterFactory";
import { IThDateToThPeriodConverter } from "../../key-metrics/period-converter/IThDateToThPeriodConverter";

export class GuestNightsSectionGenerator extends AReportSectionGeneratorStrategy {
    private static KeyMetricList = [KeyMetricType.GuestNights, KeyMetricType.GuestNightsWeekdays, KeyMetricType.GuestNightsWeekend];

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _periodType: ThPeriodType, private _kmResultItem: KeyMetricsResultItem) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Guest Nights"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return {}
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: false,
            values: []
        };
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        var data: any[] = [];
        _.filter(this._kmResultItem.metricList, (metric: KeyMetric) => {
            return _.contains(GuestNightsSectionGenerator.KeyMetricList, metric.type);
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