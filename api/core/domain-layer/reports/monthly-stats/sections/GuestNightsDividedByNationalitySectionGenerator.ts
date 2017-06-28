import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { SessionContext } from "../../../../utils/SessionContext";
import { AppContext } from "../../../../utils/AppContext";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { ReportSectionMeta, ReportSectionHeader } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ThPeriodType } from "../../key-metrics/period-converter/ThPeriodDO";
import { KeyMetricsResultItem, KeyMetric } from "../../../yield-manager/key-metrics/utils/KeyMetricsResult";
import { KeyMetricType } from "../../../yield-manager/key-metrics/utils/KeyMetricType";
import { CountryDO } from "../../../../data-layer/common/data-objects/country/CountryDO";
import { CountryContainer } from "../utils/CountryContainer";

import _ = require('underscore');

export class GuestNightsDividedByNationalitySectionGenerator extends AReportSectionGeneratorStrategy {
    private static KeyMetricList = [KeyMetricType.GuestNightsByNationality];

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _periodType: ThPeriodType, private _kmResultItem: KeyMetricsResultItem,
        private _homeCountry: CountryDO) {
        super(appContext, sessionContext, globalSummary);
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Guest Nights by Nationality"
        }
    }

    protected getGlobalSummary(): Object {
        return {};
    }

    protected getLocalSummary(): Object {
        return {};
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [

            ]
        };
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        var data: any[] = [];
        _.filter(this._kmResultItem.metricList, (metric: KeyMetric) => {
            return _.contains(GuestNightsDividedByNationalitySectionGenerator.KeyMetricList, metric.type);
        }).forEach((metric: KeyMetric) => {
            let displayName = this._appContext.thTranslate.translate(metric.displayName);
            let row: any = [displayName];
            for (var i = 0; i < metric.aggregatedValueList.length; i++) {
                let displayValue = metric.aggregatedValueList[i].metricValue.getDisplayValue(this._periodType);
                if (displayValue === '0') {
                    return;
                }
                row.push(displayValue);
            }
            data.push(row);
            row = [];
        });

        let homeCountryRow = _.find(data, (row: any[]) => {
            return row[0] === this._homeCountry.name;
        });
        let otherCountryRow = _.find(data, (row: any[]) => {
            return row[0] === CountryContainer.OtherCountryName;
        });

        data = _.filter(data, (row: any[]) => {
            return row[0] != this._homeCountry.name && row[0] != CountryContainer.OtherCountryName;
        });

        data.sort((a: any[], b: any[]) => {
            let nameA = a[0].toLowerCase(), nameB = b[0].toLowerCase()
            if (nameA < nameB)
                return -1;
            if (nameA > nameB)
                return 1;
            return 0;
        })

        data.unshift(homeCountryRow);
        data.push(otherCountryRow);

        resolve(data);


    }
}