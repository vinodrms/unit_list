import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { BookingDOConstraints } from "../../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingSearchResultRepoDO } from "../../../../data-layer/bookings/repositories/IBookingRepository";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { HotelDetailsDO } from "../../../hotel-details/utils/HotelDetailsBuilder";
import { CountryDO } from "../../../../data-layer/common/data-objects/country/CountryDO";
import { CountryContainer } from "../utils/CountryContainer";
import { KeyMetricType } from "../../../yield-manager/key-metrics/utils/KeyMetricType";
import { ThPeriodType } from "../../key-metrics/period-converter/ThPeriodDO";
import { KeyMetricsResultItem, KeyMetric } from "../../../yield-manager/key-metrics/utils/KeyMetricsResult";

import _ = require('underscore');

export class ArrivalsSectionGenerator extends AReportSectionGeneratorStrategy {
    private static KeyMetricList = [KeyMetricType.Arrivals];

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _periodType: ThPeriodType, private _kmResultItem: KeyMetricsResultItem) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Arrivals"
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
            return _.contains(ArrivalsSectionGenerator.KeyMetricList, metric.type);
        }).forEach((metric: KeyMetric) => {
            let displayValue = this._appContext.thTranslate.translate(metric.displayName);
            let row: any = [displayValue];
            for (var i = 0; i < metric.aggregatedValueList.length; i++) {
                row.push(metric.aggregatedValueList[i].metricValue.getDisplayValue(this._periodType));
            }
            data.push(row);
            row = [];
        });

        resolve(data);
    }
}