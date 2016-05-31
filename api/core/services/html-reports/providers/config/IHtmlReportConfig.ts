export interface HtmlReportConfigDO {
    htmlTemplateURLPath: string,
    reportOutputPath: string,
}

export interface IHtmlReportConfig {
    getHtmlReportPageURL(queryParams: Object): string;
    getOutputPath(queryParams: Object): string;
}