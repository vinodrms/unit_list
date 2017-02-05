import _ = require('underscore');

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

    public getNoColumns(): number {
        if (this.header.display && _.isArray(this.header.values)) {
            return this.header.values.length;
        }
        if (this.data.length > 0) {
            return this.data[0].length;
        }
        return 0;
    }
}