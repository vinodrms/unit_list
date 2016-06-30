export interface PdfReportConfigDO {
    htmlTemplateUrl: string,
    reportOutputFolder: string,
}

export interface IPdfReportConfig {
    
    getHtmlTemplateUrl(): string;

    getOutputHtmlAbsolutePath(reportParans: Object): string;

    getOutputPdfAbsolutePath(reportParans: Object): string;
}