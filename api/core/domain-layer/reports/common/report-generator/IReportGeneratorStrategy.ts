import { ReportGroup } from '../result/ReportGroup';

export interface IReportGeneratorStrategy {
    generate(params: Object): Promise<ReportGroup>;
}