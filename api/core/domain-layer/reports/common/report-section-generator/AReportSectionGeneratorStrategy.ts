import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from "../../../../utils/SessionContext";
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThUtils } from '../../../../utils/ThUtils';
import { IReportSectionGeneratorStrategy } from './IReportSectionGeneratorStrategy';
import { ReportSection, ReportSectionHeader, ReportSectionMeta } from '../result/ReportSection';

import _ = require('underscore');

export abstract class AReportSectionGeneratorStrategy implements IReportSectionGeneratorStrategy {
    protected _thUtils: ThUtils;

    constructor(protected _appContext: AppContext, protected _sessionContext: SessionContext, private _hideGlobalSummary?: boolean) {
        this._thUtils = new ThUtils();
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
        item.meta = this.getMeta();
        this.translateMetaValues(item.meta);
        this.getData().then((data: any[][]) => {
            item.data = data;
            item.globalSummary = (this._hideGlobalSummary)? undefined: this.getGlobalSummary();
            this.translateGlobalSummary(item);
            item.localSummary = this.getLocalSummary();
            this.translateLocalSummary(item);
            resolve(item);
        }).catch((e: ThError) => {
            reject(e);
        });
    }

    private translateGlobalSummary(item: ReportSection) {
        var translatedSummary = {};
        for (var key in item.globalSummary) {
            translatedSummary[this._appContext.thTranslate.translate(key)] = item.globalSummary[key];
        }
        item.globalSummary = translatedSummary;
    }

    private translateLocalSummary(item: ReportSection) {
        var translatedSummary = {};
        for (var key in item.localSummary) {
            translatedSummary[this._appContext.thTranslate.translate(key)] = item.localSummary[key];
        }
        item.localSummary = translatedSummary;
    }

    private translateHeaderValues(header: ReportSectionHeader) {
        if (!_.isArray(header.values)) { return; }
        for (var i = 0; i < header.values.length; i++) {
            header.values[i] = this._appContext.thTranslate.translate(header.values[i]);
        }
    }
    private translateMetaValues(meta: ReportSectionMeta) {
        if (!this._thUtils.isUndefinedOrNull(meta.title)) {
            meta.title = this._appContext.thTranslate.translate(meta.title);
        }
    }
    protected abstract getHeader(): ReportSectionHeader;
    protected abstract getMeta(): ReportSectionMeta;
    protected abstract getGlobalSummary(): Object;

    protected getLocalSummary(): Object {
        return {};
    }

    private getData(): Promise<any[][]> {
        return new Promise<any[][]>((resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) => {
            this.getDataCore(resolve, reject);
        });
    }
    protected abstract getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void });
}