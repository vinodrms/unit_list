export interface ReportSectionHeader {
    display: boolean;
    values?: string[];
}

export interface ReportSectionMeta {
    title?: string;
}

export class ReportSection {
    header: ReportSectionHeader;
    meta: ReportSectionMeta;
    data: any[][];
}