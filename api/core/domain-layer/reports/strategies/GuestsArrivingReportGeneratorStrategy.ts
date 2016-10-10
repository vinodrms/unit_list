import { ReportDO } from '../../../data-layer/reports/data-objects/ReportDO';
import { ReportType } from '../../../data-layer/reports/data-objects/ReportMetadataDO';
import { AReportGeneratorStrategy } from '../AReportGeneratorStrategy';
import { ThError } from '../../../utils/th-responses/ThError';

export class GuestsArrivingReportGeneratorStrategy extends AReportGeneratorStrategy {
	protected _reportType: ReportType = ReportType.GuestsArriving;

	protected validParameters(params: Object) {
		return true;
	}

	protected buildReportData(reportMetadata): Promise<ReportDO> {
		return new Promise<ReportDO>((resolve: { (result: ReportDO): void }, reject: { (err: ThError): void }) => {
			var row1 = ['Daniel 1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10'];
			var row2 = ['Nikola 1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10'];
			var report = new ReportDO();
			report.metadata = reportMetadata;
			report.data = [row1, row2];
			resolve(report);
		});
	}
}
