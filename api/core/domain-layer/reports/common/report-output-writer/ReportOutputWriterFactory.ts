import { AppContext } from '../../../../utils/AppContext';
import { IReportOutputWriter } from './IReportOutputWriter';
import { ReportOutputFormat } from '../../ReportGeneratorDO';
import { CsvReportOutputWriter } from './strategies/CsvReportOutputWriter';

export class ReportOutputWriterFactory {
    constructor(private _appContext: AppContext) {
    }

    public getOutputWriter(format: ReportOutputFormat): IReportOutputWriter {
        switch (format) {
            default:
                return new CsvReportOutputWriter(this._appContext)
        }
    }
}