import { AppContext } from '../../../../utils/AppContext';
import { IReportOutputWriter } from './IReportOutputWriter';
import { ReportOutputFormat } from '../../ReportGeneratorDO';
import { CsvReportOutputWriter } from './strategies/CsvReportOutputWriter';
import { PdfReportOutputWriter } from './strategies/PdfReportOutputWriter';

export class ReportOutputWriterFactory {
    constructor(private _appContext: AppContext) {
    }

    public getOutputWriter(format: ReportOutputFormat): IReportOutputWriter {
        switch (format) {
            default:
                return new PdfReportOutputWriter(this._appContext);
        }
    }
}