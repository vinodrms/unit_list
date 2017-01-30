import { ReportGroup } from '../result/ReportGroup';
import { ReportFileResult } from '../result/ReportFileResult';

export interface IReportOutputWriter {
    saveToFile(group: ReportGroup): Promise<ReportFileResult>;
}