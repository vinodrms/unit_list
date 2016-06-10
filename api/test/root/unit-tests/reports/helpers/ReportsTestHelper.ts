import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestUtils} from '../../../../helpers/TestUtils';
import {ReportType, HtmlReportsServiceResponse} from '../../../../../core/services/html-reports/IHtmlReportsService';
import {HtmlReportsServiceRequest} from '../../../../../core/services/html-reports/IHtmlReportsService';

export class ReportsTestHelper {

    private _testUtils: TestUtils;

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
        this._testUtils = new TestUtils();
    }

    public getInvoicePdfReportRequest(): HtmlReportsServiceRequest {
        return {
            reportType: ReportType.Invoice,
            reportParams: {},
            settings: {}
        }
    }

    public getBookingConfirmationPdfReportRequest(): HtmlReportsServiceRequest {
        return {
            reportType: ReportType.BookingConfirmation,
            reportParams: {},
            settings: {}
        }
    }
}