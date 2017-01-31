import { ReportSection } from '../result/ReportSection';

export interface IReportSectionGeneratorStrategy {
    generate(): Promise<ReportSection>;
}