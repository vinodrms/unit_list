export interface HtmlToPdfRequestDO {
    htmlUrl: string;
    pdfFileName: string;        
}

export interface HtmlToPdfResponseDO {
    filePath: string;        
}

export interface IHtmlToPdfConverterService {
    generatePdf(htmlToPdfReq: HtmlToPdfRequestDO): Promise<HtmlToPdfResponseDO>;     
}