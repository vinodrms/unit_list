import {IPdfReportConfig, PdfReportConfigDO} from './IPdfReportConfig';
import {UnitPalConfig} from '../../../../utils/environment/UnitPalConfig';

var path = require('path');

export abstract class APdfReportConfig implements IPdfReportConfig {
    
    protected _config: PdfReportConfigDO;
    
    constructor(protected _unitPalConfig: UnitPalConfig) {
    }
    
    public getHtmlTemplateUrl(): string {
        return this._config.htmlTemplateUrl;
    }

    public getOutputHtmlAbsolutePath(reportParams: Object): string {
        return path.posix.format({
            dir: this._config.reportOutputFolder,
            base: this.getReportFileName(reportParams) + '.html'
        });
    }

    public getOutputPdfAbsolutePath(reportParams: Object): string {
        return path.posix.format({
            dir: this._config.reportOutputFolder,
            base: this.getReportFileName(reportParams) + '.pdf', 
        });
    }

    protected abstract getReportFileName(reportParams: Object): string; 
}