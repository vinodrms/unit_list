import {PdfReportConfigDO} from '../IPdfReportConfig';
import {APdfReportConfig} from '../APdfReportConfig';
import {UnitPalConfig} from '../../../../../utils/environment/UnitPalConfig';

export class InvoicePdfReportConfig extends APdfReportConfig {
    constructor(unitPalConfig: UnitPalConfig) {
        super(unitPalConfig);
        
        this._config = {
            htmlTemplateUrl: 'api/reports/invoice',
            reportOutputFolder: 'output/reports/invoices'
        }
    }
    
    protected getReportFileName(reportParans: Object): string {
        return 'invoice' + reportParans['id'];
    }
}