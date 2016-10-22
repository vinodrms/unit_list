import { ReportDO } from '../../../../data-layer/reports/data-objects/ReportDO';
import { ReportType } from '../../../../data-layer/reports/data-objects/ReportMetadataDO';
import { AReportGeneratorStrategy } from '../../AReportGeneratorStrategy';
import { ThError } from '../../../../utils/th-responses/ThError';

import { ReportDepartureReader } from '../departures/ReportDepartureReader';
import { ReportDepartureInfo } from '../departures/utils/ReportDepartureInfo';

export class GuestsDepartingReportGeneratorStrategy extends AReportGeneratorStrategy {
	protected _reportType:ReportType = ReportType.GuestsDeparting;

	protected validParameters(params: Object) {
		return true;
	}

	protected buildReportData(reportMetadata): Promise<ReportDO> {
		return new Promise<ReportDO>((resolve: { (result: ReportDO): void }, reject: { (err: ThError): void }) => {
			var report = new ReportDO();
			report.metadata = reportMetadata;
			report.data = [];
			
			let departureReader = new ReportDepartureReader(this._appContext, this._sessionContext);
			departureReader.read().then((reportItems: ReportDepartureInfo[]) => {
				reportItems.forEach((item: ReportDepartureInfo) => {
					let row = [
						item.customerName,
						item.roomNumber,
						item.noAdults,
						item.noChildren,
						item.noBabies,
						item.totalPrice,
						item.notes
					];
					report.data.push(row);
				});
				resolve(report);
			})
		});
	}
}