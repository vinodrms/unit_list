import { ThError } from '../../../../utils/th-responses/ThError';
import { IReportOutputWriter } from './IReportOutputWriter';
import { ReportGroup } from '../result/ReportGroup';
import { ReportFileResult } from '../result/ReportFileResult';

export abstract class AReportOutputWriter implements IReportOutputWriter {
    public saveToFile(group: ReportGroup): Promise<ReportFileResult> {
        return new Promise<ReportFileResult>((resolve: { (result: ReportFileResult): void }, reject: { (err: ThError): void }) => {
            this.saveToFileCore(resolve, reject, group);
        });
    }
    protected abstract saveToFileCore(resolve: { (result: ReportFileResult): void }, reject: { (err: ThError): void }, group: ReportGroup);
}