import { ReportSection } from './ReportSection';
import { PageOrientation } from '../../../../services/pdf-reports/PageOrientation';

export interface ReportGroupMeta {
    name: string;
    reference?: string;
    pageOrientation?: PageOrientation;
}

export class ReportGroup {
    meta: ReportGroupMeta;
    sectionList: ReportSection[];

    constructor(meta: ReportGroupMeta) {
        this.meta = meta;
        this.sectionList = [];
    }
}