export interface HtmlToPdfRequestDO {
    htmlUrl: string;
    outputPath: string;
    settings?: Object;        
}

export interface HtmlToPdfResponseDO {
    filePath: string;        
}

export interface IHtmlToPdfConverterService {
    generatePdf(htmlToPdfReq: HtmlToPdfRequestDO): Promise<HtmlToPdfResponseDO>;     
}