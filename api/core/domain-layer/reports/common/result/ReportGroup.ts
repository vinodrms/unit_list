import { ReportItem } from './ReportItem';

export interface ReportGroupMeta {
    name: string;
}

export class ReportGroup {
    meta: ReportGroupMeta;
    itemList: ReportItem[];

    constructor(meta: ReportGroupMeta) {
        this.meta = meta;
        this.itemList = [];
    }
}