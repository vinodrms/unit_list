import {HtmlReportConfigDO} from '../IHtmlReportConfig';
import {AHtmlReportConfig} from '../AHtmlReportConfig';
import {UnitPalConfig} from '../../../../../utils/environment/UnitPalConfig';

export class BookingConfirmationHtmlReportConfig extends AHtmlReportConfig {
    constructor(unitPalConfig: UnitPalConfig) {
        super(unitPalConfig);
        
        this._reportConfig = {
            htmlTemplateURLPath: 'api/reports/booking-confirmation',
            reportOutputPath: 'output/reports/booking-confirmations'
        }
    }
    
    protected getFileName(queryParams: Object): string {
        return 'booking' + queryParams['id'] + '.pdf';
    }
}