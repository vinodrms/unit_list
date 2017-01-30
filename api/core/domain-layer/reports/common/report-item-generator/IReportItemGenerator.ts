import { ReportItem } from '../result/ReportItem';

export interface IReportItemGenerator {
    generate(): Promise<ReportItem>;
}