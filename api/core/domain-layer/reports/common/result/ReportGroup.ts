import { ReportSection } from './ReportSection';
import { PageOrientation } from '../../../../services/pdf-reports/PageOrientation';
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";

export interface ReportGroupMeta {
    name: string;
    generationTime?: string;
    displayParams?: Object;
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