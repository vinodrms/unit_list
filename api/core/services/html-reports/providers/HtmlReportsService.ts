import {ReportType, HtmlReportsServiceRequest, HtmlReportsServiceResponse} from '../IHtmlReportsService';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AHtmlReportsService} from '../AHtmlReportsService';
import {IHtmlReportConfig} from './config/IHtmlReportConfig';
import {HtmlReportConfigFactory} from './config/HtmlReportConfigFactory';
import {HtmlToPdfResponseDO} from '../../htmltopdf/IHtmlToPdfConverterService';

export class HtmlReportsService extends AHtmlReportsService {

    public generateReport(reportsServiceRequest: HtmlReportsServiceRequest): Promise<HtmlReportsServiceResponse> {
        
        return new Promise<HtmlReportsServiceResponse>((resolve: { (reportsServiceResponse?: HtmlReportsServiceResponse): void },
            reject: { (err: ThError): void }) => {
            this.generateReportCore(reportsServiceRequest, resolve, reject);
        });
    }

    public generateReportCore(req: HtmlReportsServiceRequest, resolve: { (response?: HtmlReportsServiceResponse): void },
        reject: { (err: ThError): void }) {

        var reportConfig: IHtmlReportConfig = HtmlReportConfigFactory.getHtmlReportConfig(req.reportType, this._unitPalConfig);
        
        this._htmlToPdfConverterService.generatePdf({
            htmlUrl: reportConfig.getHtmlReportPageURL(req.reportParams),
            outputPath: reportConfig.getOutputPath(req.reportParams),
            settings: req.settings
        }).then((converterRespone: HtmlToPdfResponseDO) => {
            resolve({ pdfPath: converterRespone.filePath });
        }).catch((error: ThError) => {
            reject(error);
		});
    }
}