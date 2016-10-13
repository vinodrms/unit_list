import { ReportDO } from '../../../../data-layer/reports/data-objects/ReportDO';
import { ReportType } from '../../../../data-layer/reports/data-objects/ReportMetadataDO';
import { AReportGeneratorStrategy } from '../../AReportGeneratorStrategy';
import { ThError } from '../../../../utils/th-responses/ThError';

export class GuestsInHouseReportGeneratorStrategy extends AReportGeneratorStrategy {
	protected _reportType:ReportType = ReportType.GuestsInHouse;

	protected validParameters(){
		return true;
	}

	protected buildReportData(reportMetadata): Promise<ReportDO> {
		return new Promise<ReportDO>((resolve: { (result: ReportDO): void }, reject: { (err: ThError): void }) => {
			var row1 = ['Daniel 1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10'];
			var row2 = ['Nikola 1', 'j2', 'j3', 'j4', 'j5', 'j6', 'j7', 'j8', 'j9', 'j10'];
			var row3 = ['Marcin 1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9', 'k10'];
			var report = new ReportDO();
			report.metadata = reportMetadata;
			report.data = [row1, row2];
			resolve(report);
		});
	}

}
