import { ReportDO } from '../../../../data-layer/reports/data-objects/ReportDO';
import { ReportType } from '../../../../data-layer/reports/data-objects/ReportMetadataDO';
import { AReportGeneratorStrategy } from '../../AReportGeneratorStrategy';
import { ThError } from '../../../../utils/th-responses/ThError';
import { HotelOperationsArrivalsReader } from '../../../../domain-layer/hotel-operations/dashboard/arrivals/HotelOperationsArrivalsReader';
import { ReportArrivalsReader } from '../arrivals/ReportArrivalsReader';
import { ReportArrivalItemInfo } from '../arrivals/utils/ReportArrivalsInfo';

import { HotelOperationsArrivalsInfo } from '../../../../domain-layer/hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo';

export class GuestsArrivingReportGeneratorStrategy extends AReportGeneratorStrategy {
	protected _reportType: ReportType = ReportType.GuestsArriving;

	protected validParameters(params: Object) {
		return true;
	}

	protected buildReportData(reportMetadata): Promise<ReportDO> {
		return new Promise<ReportDO>((resolve: { (result: ReportDO): void }, reject: { (err: ThError): void }) => {
			var report = new ReportDO();
			report.metadata = reportMetadata;
			report.data = [];
			
			let arrivalsReader = new ReportArrivalsReader(this._appContext, this._sessionContext);
			arrivalsReader.read().then((reportItems: ReportArrivalItemInfo[]) => {
				reportItems.forEach((item: ReportArrivalItemInfo) => {
					let row = [
						item.customerName,
						item.roomCategory,
						item.roomNumber,
						item.noAdults,
						item.noChildren,
						item.noBabies,
						item.bookingStatus,
						item.totalPrice,
						item.cancelationHours,
						item.notes
					];
					report.data.push(row);
				});
				resolve(report);
			})
		});
	}
}
