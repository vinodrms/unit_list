import {ReportType} from '../../IPdfReportsService';
import {IPdfReportConfig} from './IPdfReportConfig';
import {BookingConfirmationPdfReportConfig} from './reports/BookingConfirmationPdfReportConfig';
import {InvoicePdfReportConfig} from './reports/InvoicePdfReportConfig';
import {UnitPalConfig} from '../../../../utils/environment/UnitPalConfig';

export class PdfReportConfigFactory {
    public static getPdfReportConfig(reportType: ReportType, unitPalConfig: UnitPalConfig): IPdfReportConfig {
        switch(reportType) {
            case ReportType.BookingConfirmation: return new BookingConfirmationPdfReportConfig(unitPalConfig);
            case ReportType.Invoice: return new InvoicePdfReportConfig(unitPalConfig);
            default: return new InvoicePdfReportConfig(unitPalConfig);
        }
    } 
}