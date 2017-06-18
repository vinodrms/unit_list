import { AReportGeneratorStrategy } from "../common/report-generator/AReportGeneratorStrategy";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";
import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { CommonValidationStructures } from "../../common/CommonValidations";
import { ReportGroupMeta } from "../common/result/ReportGroup";
import { PageOrientation } from "../../../services/pdf-reports/PageOrientation";
import { IReportSectionGeneratorStrategy } from "../common/report-section-generator/IReportSectionGeneratorStrategy";
import { ThDateIntervalDO } from "../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { GuestsReportArrivalsSectionGenerator } from "./sections/GuestsReportArrivalsSectionGenerator";
import { GuestsReportStayoversSectionGenerator } from "./sections/GuestsReportStayoversSectionGenerator";
import { GuestsReportDeparturesSectionGenerator } from "./sections/GuestsReportDeparturesSectionGenerator";

export class GuestsReportGroupGenerator extends AReportGeneratorStrategy {
    private _startDate: ThDateDO;
    private _endDate: ThDateDO;

    protected getParamsValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "startDate",
                validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
            },
            {
                key: "endDate",
                validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
            },

        ]);
    }

    protected loadParameters(params: any) {
        this._startDate = new ThDateDO();
        this._startDate.buildFromObject(params.startDate);
        this._endDate = new ThDateDO();
        this._endDate.buildFromObject(params.endDate);
    }

    protected getMeta(): ReportGroupMeta {
        var startDateKey: string = this._appContext.thTranslate.translate("Start Date");
        var endDateKey: string = this._appContext.thTranslate.translate("End Date");
        var displayParams = {};
        displayParams[startDateKey] = this._startDate;
        displayParams[endDateKey] = this._endDate;

        return {
            name: "Guests Report",
            pageOrientation: PageOrientation.Portrait,
            displayParams: displayParams
        }
    }

    protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
        let interval = new ThDateIntervalDO();
        interval.buildFromObject({
            start: this._startDate,
            end: this._endDate
        });
        let dateList = interval.getThDateDOList();

        return _.chain(dateList)
            .map((date: ThDateDO) => {
                return [
                    new GuestsReportArrivalsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, date),
                    new GuestsReportStayoversSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, date),
                    new GuestsReportDeparturesSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, date)
                ];
            })
            .flatten()
            .value();
    }
}