import { PdfReportConfigDO } from '../IPdfReportConfig';
import { APdfReportConfig } from '../APdfReportConfig';
import { UnitPalConfig } from '../../../../../utils/environment/UnitPalConfig';

export class ReportPdfReportConfig extends APdfReportConfig {
    constructor(unitPalConfig: UnitPalConfig) {
        super(unitPalConfig);

        this._config = {
            htmlTemplateUrl: 'views/reports/report.ejs',
            reportOutputFolder: 'output/reports/report/'
        }
    }

    protected getReportFileName(reportParans: Object): string {
        return reportParans['meta']['name'] + "_" + reportParans['meta']['reference'];
    }
}