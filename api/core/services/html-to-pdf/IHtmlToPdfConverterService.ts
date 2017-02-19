import { PageOrientation } from '../pdf-reports/PageOrientation';

export interface HtmlToPdfRequestDO {
    htmlUrl: string;
    pdfReportOutputPath: string;
    settings?: Object;
    pageOrientation?: PageOrientation;
}

export interface HtmlToPdfResponseDO {
    filePath: string;
}

export interface IHtmlToPdfConverterService {
    generatePdf(htmlToPdfReq: HtmlToPdfRequestDO): Promise<HtmlToPdfResponseDO>;
}