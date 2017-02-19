import { PageOrientation } from './PageOrientation';

export enum ReportType {
    Invoice,
    BookingConfirmation,
    Report
}

export interface PdfReportsServiceRequest {
    reportType: ReportType;
    reportData: Object;
    settings: Object;
    pageOrientation?: PageOrientation;
}

export interface PdfReportsServiceResponse {
    pdfPath: string;
}

export interface IPdfReportsService {
    generatePdfReport(htmlReportsServiceRequest: PdfReportsServiceRequest): Promise<PdfReportsServiceResponse>;
}