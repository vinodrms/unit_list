import { ReportSection } from './ReportSection';

export interface ReportGroupMeta {
    name: string;
    reference?: string;
}

export class ReportGroup {
    meta: ReportGroupMeta;
    sectionList: ReportSection[];

    constructor(meta: ReportGroupMeta) {
        this.meta = meta;
        this.sectionList = [];
    }
}