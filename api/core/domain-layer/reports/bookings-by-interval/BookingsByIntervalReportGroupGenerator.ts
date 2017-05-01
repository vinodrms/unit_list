import { ThError } from "../../../utils/th-responses/ThError";
import { AReportGeneratorStrategy } from "../common/report-generator/AReportGeneratorStrategy";
import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../utils/th-validation/rules/StringValidationRule";
import { ArrayValidationStructure } from "../../../utils/th-validation/structure/ArrayValidationStructure";
import { NumberInListValidationRule } from "../../../utils/th-validation/rules/NumberInListValidationRule";
import { BookingDOConstraints } from "../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingConfirmationStatus } from "../../../data-layer/bookings/data-objects/BookingDO";
import { ReportGroupMeta } from "../common/result/ReportGroup";
import { ReportSection } from "../common/result/ReportSection";
import { IReportSectionGeneratorStrategy } from "../common/report-section-generator/IReportSectionGeneratorStrategy";
import { BookingsByIntervalReportSectionGenerator } from "./BookingsByIntervalReportSectionGenerator";
import { PriceProductDO } from "../../../data-layer/price-products/data-objects/PriceProductDO";
import { PageOrientation } from "../../../services/pdf-reports/PageOrientation";
import { CommonValidationStructures } from "../../common/CommonValidations";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";

export class BookingsByIntervalReportGroupGenerator extends AReportGeneratorStrategy {
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
			}
        ]);
    }

    protected loadParameters(params: any) {
        this._startDate = new ThDateDO();
		this._startDate.buildFromObject(params.startDate);
        this._endDate = new ThDateDO();
		this._endDate.buildFromObject(params.endDate);
    }

    protected getMeta(): ReportGroupMeta {
        return {
            name: "Bookings by Interval",
            pageOrientation: PageOrientation.Landscape
        }
    }

    protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
        return [
            new BookingsByIntervalReportSectionGenerator(this._appContext, this._sessionContext, this._startDate, this._endDate)
        ];
    }
}