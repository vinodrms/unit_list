import { ReportDO } from '../../../../data-layer/reports/data-objects/ReportDO';
import { ReportType } from '../../../../data-layer/reports/data-objects/ReportMetadataDO';
import { AReportGeneratorStrategy } from '../../AReportGeneratorStrategy';
import { ThError } from '../../../../utils/th-responses/ThError';

export class GuestsDepartingReportGeneratorStrategy extends AReportGeneratorStrategy {
	protected _reportType:ReportType = ReportType.GuestsDeparting;

	protected validParameters(){
		return true;
	}

	protected buildReportData(reportMetadata): Promise<ReportDO> {
		return new Promise<ReportDO>((resolve: { (result: ReportDO): void }, reject: { (err: ThError): void }) => {
			var row1 = ['Daniel 1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10'];
			var row2 = ['Nikola 1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'];
			var report = new ReportDO();
			report.metadata = reportMetadata;
			report.data = [row1, row2];
			resolve(report);
		});
	}
}