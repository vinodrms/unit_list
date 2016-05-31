import {HtmlReportConfigDO} from '../IHtmlReportConfig';
import {AHtmlReportConfig} from '../AHtmlReportConfig';
import {UnitPalConfig} from '../../../../../utils/environment/UnitPalConfig';

export class InvoiceHtmlReportConfig extends AHtmlReportConfig {
    constructor(unitPalConfig: UnitPalConfig) {
        super(unitPalConfig);
        
        this._reportConfig = {
            htmlTemplateURLPath: 'api/reports/invoice',
            reportOutputPath: 'output/reports/invoices'
        }
    }
    
    protected getFileName(queryParams: Object): string {
        return 'invoice' + queryParams['id'] + '.pdf';
    }
}