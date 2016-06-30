import {PdfReportConfigDO} from '../IPdfReportConfig';
import {APdfReportConfig} from '../APdfReportConfig';
import {UnitPalConfig} from '../../../../../utils/environment/UnitPalConfig';

export class BookingConfirmationPdfReportConfig extends APdfReportConfig {
    constructor(unitPalConfig: UnitPalConfig) {
        super(unitPalConfig);

        this._config = {
            htmlTemplateUrl: 'views/reports/booking-confirmation.ejs',
            reportOutputFolder: 'output/reports/booking-confirmation'
        }
    }
    
    protected getReportFileName(reportParams: Object): string {
        return 'booking' + reportParams['bookingConfirmationVMList'][0]['groupBookingReference'];
    }
}