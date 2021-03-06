import { IValidationStructure } from '../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import { NumberInListValidationRule } from '../../utils/th-validation/rules/NumberInListValidationRule';

export enum ReportGroupType {
    Backup,
    KeyMetrics,
    Shift,
    Housekeeping,
    Bookings,
    Invoices,
    Guests,
    GeneralStats,

}

var SupportedReportGroupTypes: ReportGroupType[] = [
    ReportGroupType.Backup,
    ReportGroupType.KeyMetrics,
    ReportGroupType.Shift,
    ReportGroupType.Housekeeping,
    ReportGroupType.Bookings,
    ReportGroupType.Invoices,
    ReportGroupType.Guests,
    ReportGroupType.GeneralStats,
    
]

export enum ReportOutputFormat {
    Csv,
    Pdf
}
var SupportedOutputFormats: ReportOutputFormat[] = [
    ReportOutputFormat.Csv,
    ReportOutputFormat.Pdf
]
export class ReportGeneratorDO {
    reportType: ReportGroupType;
    properties: Object;
    format: ReportOutputFormat;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "reportType",
                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule(SupportedReportGroupTypes))
            },
            {
                key: "properties",
                validationStruct: new ObjectValidationStructure([])
            },
            {
                key: "format",
                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule(SupportedOutputFormats))
            }
        ])
    }
}