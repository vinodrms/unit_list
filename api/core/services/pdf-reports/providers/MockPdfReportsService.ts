import {ReportType, PdfReportsServiceRequest, PdfReportsServiceResponse} from '../IPdfReportsService';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {APdfReportsService} from '../APdfReportsService';
import {IPdfReportConfig} from './config/IPdfReportConfig';
import {PdfReportConfigFactory} from './config/PdfReportConfigFactory';
import {HtmlToPdfResponseDO} from '../../html-to-pdf/IHtmlToPdfConverterService';

export class MockPdfReportsService extends APdfReportsService {

    public generatePdfReport(reportsServiceRequest: PdfReportsServiceRequest): Promise<PdfReportsServiceResponse> {
        return new Promise<PdfReportsServiceResponse>((resolve: { (reportsServiceResponse?: PdfReportsServiceResponse): void },
            reject: { (err: ThError): void }) => {
            this.generatePdfReportCore(resolve, reject);
        });
    }

    private generatePdfReportCore(resolve: { (response?: PdfReportsServiceResponse): void }, reject: { (err: ThError): void }) {
        resolve({ pdfPath: 'mock.pdf' });
    }
}