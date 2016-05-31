export enum ReportType {
	Invoice,
	BookingConfirmation
}

export interface HtmlReportsServiceRequest {
    reportType: ReportType, 
    reportParams: Object,
    settings: Object
}

export interface HtmlReportsServiceResponse {
    pdfPath: string;    
}

export interface IHtmlReportsService {
    generateReport(htmlReportsServiceRequest: HtmlReportsServiceRequest): Promise<HtmlReportsServiceResponse>; 
}