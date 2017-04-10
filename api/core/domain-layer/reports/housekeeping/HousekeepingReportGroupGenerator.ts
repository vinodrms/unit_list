import { AReportGeneratorStrategy } from "../common/report-generator/AReportGeneratorStrategy";
import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ReportGroupMeta } from "../common/result/ReportGroup";
import { IReportSectionGeneratorStrategy } from "../common/report-section-generator/IReportSectionGeneratorStrategy";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { PageOrientation } from "../../../services/pdf-reports/PageOrientation";
import { ArrivalsReportSectionGeneratorStrategy } from "./strategies/ArrivalsReportSectionGeneratorStrategy";
import { DeparturesReportSectionGeneratorStrategy } from "./strategies/DeparturesReportSectionGeneratorStrategy";
import { StayoversReportSectionGeneratorStrategy } from "./strategies/StayoversReportSectionGeneratorStrategy";

export class HousekeepingReportGroupGenerator extends AReportGeneratorStrategy {
    
    protected getParamsValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([]);
    }
    protected loadParameters(params: any) { }

    protected getMeta(): ReportGroupMeta {
        return {
			name: "Housekeeping Report",
			pageOrientation: PageOrientation.Landscape
		}
    }
    protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
        return [
			new ArrivalsReportSectionGeneratorStrategy(this._appContext, this._sessionContext),
			new StayoversReportSectionGeneratorStrategy(this._appContext, this._sessionContext),
			new DeparturesReportSectionGeneratorStrategy(this._appContext, this._sessionContext),
		];
    }


}