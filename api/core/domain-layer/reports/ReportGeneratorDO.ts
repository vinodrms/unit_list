import { IValidationStructure } from '../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import { NumberInListValidationRule } from '../../utils/th-validation/rules/NumberInListValidationRule';

export enum ReportGroupType {
    Backup,
    KeyMetrics,
    ShiftReport
}

var SupportedReportGroupTypes: ReportGroupType[] = [
    ReportGroupType.Backup,
    ReportGroupType.KeyMetrics,
    ReportGroupType.ShiftReport,
]

// TODO: add Pdf & add validation in getValidationStructure()
export enum ReportOutputFormat {
    Csv
}

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
            }
        ])
    }
}