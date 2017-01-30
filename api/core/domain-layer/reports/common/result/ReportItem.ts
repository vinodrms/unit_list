export interface ReportItemHeader {
    displayHeader: boolean;
    values?: string[];
}

export class ReportItem {
    header: ReportItemHeader;
    data: any[][];
}