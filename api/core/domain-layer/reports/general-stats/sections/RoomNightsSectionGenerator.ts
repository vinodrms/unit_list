import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { BookingDOConstraints } from "../../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingSearchResultRepoDO } from "../../../../data-layer/bookings/repositories/IBookingRepository";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { KeyMetricType } from "../../../yield-manager/key-metrics/utils/KeyMetricType";
import { KeyMetricsResultItem, KeyMetric } from "../../../yield-manager/key-metrics/utils/KeyMetricsResult";
import { ThPeriodType } from "../../key-metrics/period-converter/ThPeriodDO";

import _ = require('underscore');

export class RoomNightsSectionGenerator extends AReportSectionGeneratorStrategy {
    private static KeyMetricList = [KeyMetricType.RoomNights];

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _periodType: ThPeriodType, private _kmResultItem: KeyMetricsResultItem, private _reportSectionHeader: ReportSectionHeader) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Room Nights Total"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return {}
    }

    protected getHeader(): ReportSectionHeader {
        return this._reportSectionHeader;
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        var data: any[] = [];
        _.filter(this._kmResultItem.metricList, (metric: KeyMetric) => {
            return _.contains(RoomNightsSectionGenerator.KeyMetricList, metric.type);
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