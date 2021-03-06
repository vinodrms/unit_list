import { ReportType } from '../../IPdfReportsService';
import { IPdfReportConfig } from './IPdfReportConfig';
import { BookingConfirmationPdfReportConfig } from './reports/BookingConfirmationPdfReportConfig';
import { InvoiceConfirmationPdfReportConfig } from './reports/InvoiceConfirmationPdfReportConfig';
import { ReportPdfReportConfig } from './reports/ReportPdfReportConfig';
import { UnitPalConfig } from '../../../../utils/environment/UnitPalConfig';

export class PdfReportConfigFactory {
    public static getPdfReportConfig(reportType: ReportType, unitPalConfig: UnitPalConfig): IPdfReportConfig {
        switch (reportType) {
            case ReportType.BookingConfirmation: return new BookingConfirmationPdfReportConfig(unitPalConfig);
            case ReportType.Invoice: return new InvoiceConfirmationPdfReportConfig(unitPalConfig);
            case ReportType.Report: return new ReportPdfReportConfig(unitPalConfig);
            default: return new InvoiceConfirmationPdfReportConfig(unitPalConfig);
        }
    }
}