import { AppContext } from '../../../../../utils/AppContext';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { AReportOutputWriter } from '../AReportOutputWriter';
import { ReportGroup } from '../../result/ReportGroup';
import { ReportFileResult } from '../../result/ReportFileResult';
import { ReportType, PdfReportsServiceResponse } from '../../../../../services/pdf-reports/IPdfReportsService';

export class PdfReportOutputWriter extends AReportOutputWriter {

    constructor(private _appContext: AppContext) {
        super();
    }

    protected saveToFileCore(resolve: { (result: ReportFileResult): void }, reject: { (err: ThError): void }, group: ReportGroup) {
        let pdfReportsService = this._appContext.getServiceFactory().getPdfReportsService();
        pdfReportsService.generatePdfReport({
            reportType: ReportType.Report,
            reportData: group,
            settings: {}
        }).then((pdfResponse: PdfReportsServiceResponse) => {
            resolve({
                reportPath: pdfResponse.pdfPath
            })
        }).catch((e) => {
            reject(e);
        })
    }
}