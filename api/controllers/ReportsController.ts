import {ThLogger, ThLogLevel} from '../core/utils/logging/ThLogger';
import {ThError} from '../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../core/utils/th-responses/ThResponse';
import {BaseController} from './base/BaseController';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {HtmlToPdfRequestDO, HtmlToPdfResponseDO} from '../core/services/htmltopdf/IHtmlToPdfConverterService';
import {ReportType, HtmlReportsServiceResponse} from '../core/services/html-reports/IHtmlReportsService';

export class ReportsController extends BaseController {

    public generateBookingConfirmationPage(req: Express.Request, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        
        //TODO call repository method in order to fetch the necessary data;
        // if no data is available for the requester hotel and the ids provided return
        // 401, unauthorized
        
        return res.view("reports/booking-confirmation", {
            user: {
                email: sessionContext.sessionDO.user.email
            }
        });
        // res.send(401);
    }

    public generateInvoicePage(req: Express.Request, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        
        //TODO call repository method in order to fetch the necessary data;
        // if no data is available for the requester hotel and the ids provided return
        // 401, unauthorized
        
        return res.view("reports/invoice", {
            user: {
                email: sessionContext.sessionDO.user.email
            }
        });
        // res.send(401);
    }
    
    // Just for testing purposes
    // TODO
    // Remove method after the first report execution is integrated
    public getPdf(req: Express.Request, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        // var reportUrl: string = req.body.reportUrl;
        // var exportFileName: string = req.body.reportExportTo;

        var reportUrl: string = "http://localhost:8001/api/reports/bookings";
        var exportFileName: string = "test.pdf";

        var htmltoPdfReq = {
            htmlUrl: reportUrl,
            outputPath: exportFileName,
            settings: {
                cookie: req["headers"]["cookie"]
            }
        };

        appContext.getServiceFactory().getHtmltoPdfConverterService().generatePdf(htmltoPdfReq).then((pdfGeneratorResponse: HtmlToPdfResponseDO) => {
            res.download(pdfGeneratorResponse.filePath);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.PhantomHtmlToPdfGenerationError);
        });
    }
    
    // Just for testing purposes
    // TODO
    // Remove method after the first report execution is integrated
    public testReportService(req: Express.Request, res: any) {
        var appContext: AppContext = req.appContext;
        
        var reportType: ReportType;
        switch(req.query.reportType) {
            case '0': reportType = ReportType.BookingConfirmation; break;
            case '1': reportType = ReportType.Invoice; break;
            default: reportType = ReportType.BookingConfirmation;
        }
        
        var htmlReportsService = appContext.getServiceFactory().getHtmlReportsService(appContext.getServiceFactory().getHtmltoPdfConverterService());
        htmlReportsService.generateReport({
            reportType: reportType, 
            reportParams: {id: req.query.id}, 
            settings: {
                cookie: req["headers"]["cookie"]
            }
        }).then((result: HtmlReportsServiceResponse) => {
            this.returnSuccesfulResponse(req, res, result);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, null);
        });
    }
}

var reportsController = new ReportsController();
// TODO
// Remove testReportService after the first report execution is integrated
module.exports = {
    generateBookingConfirmationPage: reportsController.generateBookingConfirmationPage.bind(reportsController),
    generateInvoicePage: reportsController.generateInvoicePage.bind(reportsController),
    testReportService: reportsController.testReportService.bind(reportsController),
}
