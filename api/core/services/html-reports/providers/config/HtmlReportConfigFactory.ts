import {ReportType} from '../../IHtmlReportsService';
import {IHtmlReportConfig} from './IHtmlReportConfig';
import {BookingConfirmationHtmlReportConfig} from './reports/BookingConfirmationHtmlReportConfig';
import {InvoiceHtmlReportConfig} from './reports/InvoiceHtmlReportConfig';
import {UnitPalConfig} from '../../../../utils/environment/UnitPalConfig';

export class HtmlReportConfigFactory {
    public static getHtmlReportConfig(reportType: ReportType, unitPalConfig: UnitPalConfig): IHtmlReportConfig {
        switch(reportType) {
            case ReportType.BookingConfirmation: return new BookingConfirmationHtmlReportConfig(unitPalConfig);
            case ReportType.Invoice: return new InvoiceHtmlReportConfig(unitPalConfig);
            default: return new InvoiceHtmlReportConfig(unitPalConfig);
        }
    } 
}