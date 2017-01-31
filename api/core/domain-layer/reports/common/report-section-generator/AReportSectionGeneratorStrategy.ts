import { AppContext } from '../../../../utils/AppContext';
import { IReportSectionGeneratorStrategy } from './IReportSectionGeneratorStrategy';
import { ReportSection, ReportSectionHeader } from '../result/ReportSection';
import { ThError } from '../../../../utils/th-responses/ThError';

import _ = require('underscore');

export abstract class AReportSectionGeneratorStrategy implements IReportSectionGeneratorStrategy {

    constructor(protected _appContext: AppContext) {
    }

    public generate(): Promise<ReportSection> {
        return new Promise<ReportSection>((resolve: { (result: ReportSection): void }, reject: { (err: ThError): void }) => {
            this.generateCore(resolve, reject);
        });
    }
    private generateCore(resolve: { (result: ReportSection): void }, reject: { (err: ThError): void }) {
        var item = new ReportSection();
        item.header = this.getHeader();
        this.translateHeaderValues(item.header);
        this.getData().then((data: any[][]) => {
            item.data = data;
            resolve(item);
        }).catch((e: ThError) => {
            reject(e);
        });
    }
    private translateHeaderValues(header: ReportSectionHeader) {
        if (!_.isArray(header.values)) { return; }
        for (var i = 0; i < header.values.length; i++) {
            header.values[i] = this._appContext.thTranslate.translate(header.values[i]);
        }
    }
    protected abstract getHeader(): ReportSectionHeader;

    private getData(): Promise<any[][]> {
        return new Promise<any[][]>((resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) => {
            this.getDataCore(resolve, reject);
        });
    }
    protected abstract getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void });
}