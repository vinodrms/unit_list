import { AppContext } from '../../utils/AppContext';
import { ReportDO } from '../../data-layer/reports/data-objects/ReportDO';

export interface IReportGeneratorStrategy {
	generate(params: Object): Promise<ReportDO>;
}