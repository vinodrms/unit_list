import {PdfReportConfigDO} from '../IPdfReportConfig';
import {APdfReportConfig} from '../APdfReportConfig';
import {UnitPalConfig} from '../../../../../utils/environment/UnitPalConfig';

export class InvoiceConfirmationPdfReportConfig extends APdfReportConfig {
    constructor(unitPalConfig: UnitPalConfig) {
        super(unitPalConfig);
        
        this._config = {
            htmlTemplateUrl: 'views/reports/invoice.ejs',
            reportOutputFolder: 'output/reports/invoices'
        }
    }
    
    protected getReportFileName(reportParans: Object): string {
        return 'invoice' + '_' + reportParans['invoiceReference'] + '_' + reportParans['payerIndex'];
    }
}