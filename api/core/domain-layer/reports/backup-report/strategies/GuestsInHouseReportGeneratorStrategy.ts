import { ReportDO } from '../../../../data-layer/reports/data-objects/ReportDO';
import { ReportType } from '../../../../data-layer/reports/data-objects/ReportMetadataDO';
import { AReportGeneratorStrategy } from '../../AReportGeneratorStrategy';
import { ThError } from '../../../../utils/th-responses/ThError';

import { ReportInHouseReader } from '../in-house/ReportInHouseReader';
import { ReportInHouseItemInfo } from '../in-house/utils/ReportInHouseInfo';

import { HotelOperationsArrivalsInfo } from '../../../../domain-layer/hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo';
export class GuestsInHouseReportGeneratorStrategy extends AReportGeneratorStrategy {
	protected _reportType:ReportType = ReportType.GuestsInHouse;

	protected validParameters(params: Object) {
		return true;
	}

	protected buildReportData(reportMetadata): Promise<ReportDO> {
		return new Promise<ReportDO>((resolve: { (result: ReportDO): void }, reject: { (err: ThError): void }) => {
			var report = new ReportDO();
			report.metadata = reportMetadata;
			report.data = [];
			
			let inhouseReader = new ReportInHouseReader(this._appContext, this._sessionContext);
			inhouseReader.read().then((reportItems: ReportInHouseItemInfo[]) => {
				reportItems.forEach((item: ReportInHouseItemInfo) => {
					let row = [
						item.customerName,
						item.roomNumber,
						item.noAdults,
						item.noChildren,
						item.noBabies,
						item.departingDate,
						item.notes
					];
					report.data.push(row);
				});
				resolve(report);
			})
		});
	}

}
