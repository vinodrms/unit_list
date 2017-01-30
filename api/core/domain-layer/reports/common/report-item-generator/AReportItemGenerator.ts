import { AppContext } from '../../../../utils/AppContext';
import { IReportItemGenerator } from './IReportItemGenerator';
import { ReportItem, ReportItemHeader } from '../result/ReportItem';
import { ThError } from '../../../../utils/th-responses/ThError';

import _ = require('underscore');

export abstract class AReportItemGenerator implements IReportItemGenerator {

    constructor(protected _appContext: AppContext) {
    }

    public generate(): Promise<ReportItem> {
        return new Promise<ReportItem>((resolve: { (result: ReportItem): void }, reject: { (err: ThError): void }) => {
            this.generateCore(resolve, reject);
        });
    }
    private generateCore(resolve: { (result: ReportItem): void }, reject: { (err: ThError): void }) {
        var item = new ReportItem();
        item.header = this.getHeader();
        this.translateHeaderValues(item.header);
        this.getData().then((data: any[][]) => {
            item.data = data;
            resolve(item);
        }).catch((e: ThError) => {
            reject(e);
        });
    }
    private translateHeaderValues(header: ReportItemHeader) {
        if (!_.isArray(header.values)) { return; }
        for (var i = 0; i < header.values.length; i++) {
            header.values[i] = this._appContext.thTranslate.translate(header.values[i]);
        }
    }
    protected abstract getHeader(): ReportItemHeader;

    private getData(): Promise<any[][]> {
        return new Promise<any[][]>((resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) => {
            this.getDataCore(resolve, reject);
        });
    }
    protected abstract getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void });
}