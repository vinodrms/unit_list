export interface ReportSectionHeader {
    display: boolean;
    values?: string[];
}

export class ReportSection {
    header: ReportSectionHeader;
    data: any[][];
}