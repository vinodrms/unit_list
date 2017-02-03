export enum ReportOutputFormatType {
    Csv,
    Pdf
}

export class ReportOutputFormat {
    type: ReportOutputFormatType;
    displayName: string;

    constructor(type: ReportOutputFormatType, displayName: string) {
        this.type = type;
        this.displayName = displayName;
    }

    public static getPossibleValues(): ReportOutputFormat[] {
        return [
            new ReportOutputFormat(ReportOutputFormatType.Pdf, "PDF"),
            new ReportOutputFormat(ReportOutputFormatType.Csv, "CSV")
        ]
    }
}